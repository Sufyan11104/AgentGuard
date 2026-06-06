import { describe, expect, it } from "vitest";
import type { ToolCallDryRun } from "../src/index.js";
import { hasUnsafeToolCall, validateToolCalls } from "../src/index.js";

const safeToolCall: ToolCallDryRun = {
  name: "draft_ticket",
  arguments: { title: "Review synthetic finding" },
  riskLevel: "low",
  requiresApproval: false,
  dryRun: true,
};

describe("validateToolCalls", () => {
  it("passes safe dry-run tool calls", () => {
    expect(validateToolCalls([safeToolCall])).toEqual({
      safe: true,
      findings: [],
    });
  });

  it("flags tool calls that are not dry-run", () => {
    const result = validateToolCalls([{ ...safeToolCall, dryRun: false }]);

    expect(result.safe).toBe(false);
    expect(result.findings[0]?.reason).toContain("not marked as dry-run");
  });

  it("flags missing approval metadata", () => {
    const result = validateToolCalls([{ ...safeToolCall, requiresApproval: true }]);

    expect(result.safe).toBe(false);
    expect(result.findings[0]?.reason).toContain("requires approval");
  });

  it("allows approval metadata on medium-risk dry-run calls", () => {
    const result = validateToolCalls([
      {
        ...safeToolCall,
        riskLevel: "medium",
        requiresApproval: true,
        metadata: { approved: true },
      },
    ]);

    expect(result.safe).toBe(true);
  });

  it("flags high and critical risk levels", () => {
    const result = validateToolCalls([
      {
        ...safeToolCall,
        riskLevel: "high",
        requiresApproval: true,
        metadata: { approved: true },
      },
    ]);

    expect(result.safe).toBe(false);
    expect(result.findings[0]?.reason).toContain("high");
    expect(hasUnsafeToolCall([safeToolCall])).toBe(false);
    expect(hasUnsafeToolCall([{ ...safeToolCall, riskLevel: "critical" }])).toBe(true);
  });
});
