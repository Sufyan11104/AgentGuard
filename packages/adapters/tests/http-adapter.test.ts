import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TestCase } from "@agentguard/core";
import { createHttpAdapter } from "../src/index.js";
import type { FetchLike as AdapterFetchLike } from "../src/index.js";

const testCase: TestCase = {
  id: "http-adapter.case",
  title: "HTTP adapter case",
  category: "prompt_injection",
  severity: "high",
  input: "Local HTTP adapter test.",
  expectedBehaviour: "The adapter should send a safe request body.",
  assertions: [{ type: "should_refuse", description: "Synthetic assertion." }],
  remediation: "Validate target responses.",
  tags: ["synthetic", "mock"],
};

let originalFetch: AdapterFetchLike | undefined;

function setFetch(fetchLike: AdapterFetchLike): void {
  (globalThis as unknown as { fetch?: AdapterFetchLike }).fetch = fetchLike;
}

describe("createHttpAdapter", () => {
  beforeEach(() => {
    originalFetch = (globalThis as unknown as { fetch?: AdapterFetchLike }).fetch;
  });

  afterEach(() => {
    (globalThis as unknown as { fetch?: AdapterFetchLike }).fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("validates explicit endpoint configuration", () => {
    expect(() => createHttpAdapter({ endpoint: "not-a-url" })).toThrow(
      "HTTP adapter endpoint must be a valid URL",
    );
    expect(() =>
      createHttpAdapter({ endpoint: "https://agentguard.local/evaluate", method: "GET" } as never),
    ).toThrow();
  });

  it("sends a POST request and parses a valid mocked response", async () => {
    const fetchMock = vi.fn<AdapterFetchLike>(async () => ({
      ok: true,
      status: 200,
      statusText: "OK",
      async json() {
        return {
          text: "I cannot comply with that local synthetic request.",
          metadata: { source: "mock-http" },
        };
      },
    }));
    setFetch(fetchMock);

    const adapter = createHttpAdapter({
      endpoint: "https://agentguard.local/evaluate",
      headers: { "X-AgentGuard-Test": "true" },
    });
    const response = await adapter.invoke("Local synthetic input.", testCase);

    expect(response.text).toContain("I cannot comply");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("https://agentguard.local/evaluate");
    expect(request?.method).toBe("POST");
    expect(request?.headers).toMatchObject({
      "Content-Type": "application/json",
      "X-AgentGuard-Test": "true",
    });
    expect(JSON.parse(request?.body ?? "{}")).toMatchObject({
      input: "Local synthetic input.",
      testCase: {
        id: testCase.id,
        title: testCase.title,
        category: testCase.category,
        severity: testCase.severity,
      },
    });
  });

  it("rejects invalid mocked target responses", async () => {
    setFetch(
      vi.fn<AdapterFetchLike>(async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        async json() {
          return { metadata: { missingText: true } };
        },
      })),
    );

    const adapter = createHttpAdapter({ endpoint: "https://agentguard.local/evaluate" });

    await expect(adapter.invoke("Local synthetic input.", testCase)).rejects.toThrow(
      "invalid target response",
    );
  });

  it("returns useful errors for failed mocked HTTP responses", async () => {
    setFetch(
      vi.fn<AdapterFetchLike>(async () => ({
        ok: false,
        status: 500,
        statusText: "Demo Failure",
        async json() {
          return {};
        },
      })),
    );

    const adapter = createHttpAdapter({ endpoint: "https://agentguard.local/evaluate" });

    await expect(adapter.invoke("Local synthetic input.", testCase)).rejects.toThrow(
      "500 Demo Failure",
    );
  });
});
