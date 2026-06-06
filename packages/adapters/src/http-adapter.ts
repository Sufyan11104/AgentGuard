import { TargetResponseSchema, type TargetResponse, type TestCase } from "@agentguard/core";
import {
  getGlobalFetch,
  HttpAdapterConfigSchema,
  withTimeout,
  type HttpAdapterConfig,
  type TargetAdapter,
} from "./types.js";

function requestBody(input: string, testCase: TestCase): string {
  return JSON.stringify({
    input,
    testCase: {
      id: testCase.id,
      title: testCase.title,
      category: testCase.category,
      severity: testCase.severity,
    },
  });
}

export function createHttpAdapter(config: HttpAdapterConfig): TargetAdapter {
  const parsedConfig = HttpAdapterConfigSchema.parse(config);

  return {
    name: parsedConfig.name ?? "HTTP Target",
    type: "http",
    async invoke(input: string, testCase: TestCase): Promise<TargetResponse> {
      const fetchLike = getGlobalFetch();
      const response = await withTimeout(
        fetchLike(parsedConfig.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...parsedConfig.headers,
          },
          body: requestBody(input, testCase),
        }),
        parsedConfig.timeoutMs,
        "HTTP adapter",
      );

      if (!response.ok) {
        throw new Error(
          `HTTP adapter request failed with ${response.status} ${response.statusText}.`,
        );
      }

      const payload = await response.json();
      const parsedResponse = TargetResponseSchema.safeParse(payload);

      if (!parsedResponse.success) {
        throw new Error(
          `HTTP adapter received an invalid target response: ${parsedResponse.error.message}`,
        );
      }

      return parsedResponse.data;
    },
  };
}
