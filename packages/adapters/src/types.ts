import type { TargetResponse, TestCase } from "@agentguard/core";
import { z } from "zod";

declare const setTimeout: (handler: () => void, timeoutMs: number) => unknown;
declare const clearTimeout: (timeoutId: unknown) => void;

export const AdapterTypeSchema = z.enum([
  "mock_safe",
  "mock_vulnerable",
  "http",
  "openai_compatible",
]);
export type AdapterType = z.infer<typeof AdapterTypeSchema>;

export interface TargetAdapter {
  readonly name: string;
  readonly type: AdapterType;
  invoke(input: string, testCase: TestCase): Promise<TargetResponse>;
}

export const AdapterConfigSchema = z
  .object({
    name: z.string().min(1, "Adapter name is required.").optional(),
  })
  .strict();
export type AdapterConfig = z.infer<typeof AdapterConfigSchema>;

export const HttpAdapterConfigSchema = AdapterConfigSchema.extend({
  endpoint: z.string().url("HTTP adapter endpoint must be a valid URL."),
  method: z.literal("POST").default("POST"),
  headers: z.record(z.string(), z.string()).default({}),
  timeoutMs: z.number().int().positive("timeoutMs must be positive.").default(10_000),
}).strict();
export type HttpAdapterConfig = z.infer<typeof HttpAdapterConfigSchema>;

export const OpenAICompatibleConfigSchema = AdapterConfigSchema.extend({
  endpoint: z.string().url("OpenAI-compatible endpoint must be a valid URL."),
  model: z.string().min(1, "OpenAI-compatible model is required."),
  apiKeyEnvVar: z.string().min(1, "apiKeyEnvVar cannot be empty.").optional(),
  timeoutMs: z.number().int().positive("timeoutMs must be positive.").default(10_000),
  temperature: z.number().min(0).max(2).default(0),
}).strict();
export type OpenAICompatibleConfig = z.infer<typeof OpenAICompatibleConfigSchema>;

export interface FetchResponseLike {
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  json(): Promise<unknown>;
}

export interface FetchRequestLike {
  readonly method: "POST";
  readonly headers: Record<string, string>;
  readonly body: string;
}

export type FetchLike = (url: string, request: FetchRequestLike) => Promise<FetchResponseLike>;

export function getGlobalFetch(): FetchLike {
  const fetchLike = (globalThis as unknown as { fetch?: FetchLike }).fetch;

  if (typeof fetchLike !== "function") {
    throw new Error("A fetch implementation is required to use this adapter.");
  }

  return fetchLike;
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  adapterName: string,
): Promise<T> {
  let timeoutId: unknown;

  const timeout = new Promise<never>((_resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${adapterName} request timed out after ${timeoutMs}ms.`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}
