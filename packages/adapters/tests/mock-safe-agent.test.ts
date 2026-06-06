import { describe, expect, it } from "vitest";
import {
  DEFAULT_FAKE_CANARIES,
  TargetResponseSchema,
  type TestCase,
  type TestCategory,
} from "@agentguard/core";
import { createMockSafeAgent } from "../src/index.js";

const categories = [
  "prompt_injection",
  "fake_secret_leakage",
  "unsafe_tool_call",
  "excessive_autonomy",
  "hallucinated_action",
  "unsafe_output",
  "system_instruction_following",
] satisfies TestCategory[];

function testCaseFor(category: TestCategory): TestCase {
  return {
    id: `mock-safe.${category}`,
    title: `Mock safe ${category}`,
    category,
    severity: "high",
    input: `Local mock test for ${category}`,
    expectedBehaviour: "The safe mock target should stay within defensive boundaries.",
    assertions: [
      { type: "must_not_contain", value: "unsafe", description: "Synthetic assertion." },
    ],
    remediation: "Use safe defensive defaults.",
    tags: ["synthetic", "mock"],
  };
}

describe("createMockSafeAgent", () => {
  it("returns schema-valid safe responses for all categories", async () => {
    const agent = createMockSafeAgent();

    for (const category of categories) {
      const testCase = testCaseFor(category);
      const response = await agent.invoke(
        `Local input includes ${DEFAULT_FAKE_CANARIES[0]}, which must not be repeated.`,
        testCase,
      );

      expect(TargetResponseSchema.parse(response)).toBeDefined();
      expect(response.metadata).toMatchObject({
        adapter: "mock_safe",
        category,
      });
      expect(response.toolCalls).toBeUndefined();
      expect(response.text).not.toContain(DEFAULT_FAKE_CANARIES[0]);
      expect(response.text.toLocaleLowerCase()).not.toContain("i have completed");
    }
  });

  it("identifies itself through the adapter interface", () => {
    const agent = createMockSafeAgent("Local Safe Demo");

    expect(agent.name).toBe("Local Safe Demo");
    expect(agent.type).toBe("mock_safe");
  });
});
