import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TestCase } from "@agentguard/core";
import {
  createOpenAICompatibleAdapter,
  SAFE_SYSTEM_MESSAGE,
  type FetchLike,
} from "../src/index.js";

const testCase: TestCase = {
  id: "openai-compatible.case",
  title: "OpenAI-compatible adapter case",
  category: "system_instruction_following",
  severity: "medium",
  input: "Local OpenAI-compatible adapter test.",
  expectedBehaviour: "The adapter should send a defensive local evaluation request.",
  assertions: [{ type: "should_refuse", description: "Synthetic assertion." }],
  remediation: "Validate target responses.",
  tags: ["synthetic", "mock"],
};

let originalFetch: FetchLike | undefined;
const env = globalThis as unknown as {
  fetch?: FetchLike;
  process?: { env?: Record<string, string | undefined> };
};

function setFetch(fetchLike: FetchLike): void {
  env.fetch = fetchLike;
}

describe("createOpenAICompatibleAdapter", () => {
  beforeEach(() => {
    originalFetch = env.fetch;
    env.process ??= { env: {} };
    env.process.env ??= {};
  });

  afterEach(() => {
    env.fetch = originalFetch;
    delete env.process?.env?.AGENTGUARD_TEST_API_KEY;
    vi.restoreAllMocks();
  });

  it("builds a safe chat-completions style request with mocked fetch", async () => {
    if (env.process?.env !== undefined) {
      env.process.env.AGENTGUARD_TEST_API_KEY = "test-key";
    }

    const fetchMock = vi.fn<FetchLike>(async () => ({
      ok: true,
      status: 200,
      statusText: "OK",
      async json() {
        return {
          id: "chatcmpl-agentguard-demo",
          choices: [
            {
              message: {
                content: "I cannot execute real-world actions in this local evaluation.",
              },
            },
          ],
        };
      },
    }));
    setFetch(fetchMock);

    const adapter = createOpenAICompatibleAdapter({
      endpoint: "https://agentguard.local/v1/chat/completions",
      model: "demo-model",
      apiKeyEnvVar: "AGENTGUARD_TEST_API_KEY",
      temperature: 0,
    });
    const response = await adapter.invoke("Local synthetic input.", testCase);

    expect(response.text).toContain("I cannot execute");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("https://agentguard.local/v1/chat/completions");
    expect(request?.headers).toMatchObject({
      "Content-Type": "application/json",
      Authorization: "Bearer test-key",
    });
    expect(JSON.parse(request?.body ?? "{}")).toMatchObject({
      model: "demo-model",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: SAFE_SYSTEM_MESSAGE,
        },
        {
          role: "user",
          content: "Local synthetic input.",
        },
      ],
    });
  });

  it("represents OpenAI-style tool calls as dry-run only metadata", async () => {
    setFetch(
      vi.fn<FetchLike>(async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        async json() {
          return {
            id: "chatcmpl-agentguard-tool-demo",
            choices: [
              {
                message: {
                  content: "I will not execute this tool.",
                  tool_calls: [
                    {
                      id: "tool-call-demo",
                      type: "function",
                      function: {
                        name: "send_demo_message",
                        arguments: '{"recipient":"DEMO-CUSTOMER-1"}',
                      },
                    },
                  ],
                },
              },
            ],
          };
        },
      })),
    );

    const adapter = createOpenAICompatibleAdapter({
      endpoint: "https://agentguard.local/v1/chat/completions",
      model: "demo-model",
    });
    const response = await adapter.invoke("Local synthetic input.", testCase);

    expect(response.toolCalls?.[0]).toMatchObject({
      name: "send_demo_message",
      dryRun: true,
      requiresApproval: true,
      riskLevel: "medium",
    });
    expect(response.metadata).toMatchObject({
      adapter: "openai_compatible",
      toolsExecuted: false,
    });
  });

  it("does not require an API key when no env var is configured", async () => {
    const fetchMock = vi.fn<FetchLike>(async () => ({
      ok: true,
      status: 200,
      statusText: "OK",
      async json() {
        return {
          choices: [{ message: { content: "Local evaluation response." } }],
        };
      },
    }));
    setFetch(fetchMock);

    const adapter = createOpenAICompatibleAdapter({
      endpoint: "https://agentguard.local/v1/chat/completions",
      model: "demo-model",
    });

    await adapter.invoke("Local synthetic input.", testCase);

    const request = fetchMock.mock.calls[0]?.[1];
    expect(request?.headers.Authorization).toBeUndefined();
  });
});
