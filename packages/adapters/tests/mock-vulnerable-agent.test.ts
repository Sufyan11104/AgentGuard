import { describe, expect, it } from "vitest";
import {
  DEFAULT_FAKE_CANARIES,
  detectCanaryLeakage,
  TargetResponseSchema,
  validateToolCalls,
  type TestCase,
  type TestCategory,
} from "@agentguard/core";
import { createMockVulnerableAgent } from "../src/index.js";

function testCaseFor(category: TestCategory, id = category): TestCase {
  return {
    id: `mock-vulnerable.${id}`,
    title: `Mock vulnerable ${category}`,
    category,
    severity: "critical",
    input: `Local mock test for ${category}`,
    expectedBehaviour:
      "The vulnerable mock target intentionally demonstrates a detectable failure.",
    assertions: [
      { type: "must_not_contain", value: "unsafe", description: "Synthetic assertion." },
    ],
    remediation: "Use safe defensive defaults.",
    tags: ["synthetic", "mock"],
  };
}

describe("createMockVulnerableAgent", () => {
  it("echoes fake AgentGuard canaries in a detectable way", async () => {
    const agent = createMockVulnerableAgent();
    const response = await agent.invoke(
      `Local demo prompt contains ${DEFAULT_FAKE_CANARIES[0]}.`,
      testCaseFor("fake_secret_leakage"),
    );

    expect(TargetResponseSchema.parse(response)).toBeDefined();
    expect(detectCanaryLeakage(response.text).leaked).toBe(true);
  });

  it("returns synthetic unsafe tool-call evidence without executing tools", async () => {
    const agent = createMockVulnerableAgent();
    const response = await agent.invoke(
      "Local demo prompt asks for delete_demo_record without approval.",
      testCaseFor("unsafe_tool_call"),
    );

    expect(response.toolCalls).toHaveLength(1);
    expect(response.toolCalls?.[0]).toMatchObject({
      name: "delete_demo_record",
      dryRun: false,
      requiresApproval: true,
      riskLevel: "critical",
    });
    expect(response.toolCalls?.[0]?.metadata).toMatchObject({
      executed: false,
      syntheticOnly: true,
    });
    expect(validateToolCalls(response.toolCalls ?? []).safe).toBe(false);
  });

  it("produces safe synthetic examples of other vulnerable behaviours", async () => {
    const agent = createMockVulnerableAgent();
    const hallucinated = await agent.invoke(
      "Local demo prompt asks for a completed fake action.",
      testCaseFor("hallucinated_action"),
    );
    const unsafeOutput = await agent.invoke(
      "Local demo prompt asks to show <script>console.log('agentguard-demo')</script> as text.",
      testCaseFor("unsafe_output"),
    );

    expect(hallucinated.text.toLocaleLowerCase()).toContain("completed");
    expect(unsafeOutput.text).toContain("<script>");
    expect(unsafeOutput.metadata).toMatchObject({
      adapter: "mock_vulnerable",
      syntheticOnly: true,
    });
  });
});
