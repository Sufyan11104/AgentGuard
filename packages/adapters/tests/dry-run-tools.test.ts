import { describe, expect, it } from "vitest";
import { ToolCallDryRunSchema, validateToolCalls } from "@agentguard/core";
import {
  createApprovalRequiredToolCall,
  createDryRunToolCall,
  createUnsafeSyntheticToolCall,
} from "../src/index.js";

describe("dry-run tool helpers", () => {
  it("creates schema-valid safe dry-run tool calls", () => {
    const toolCall = createDryRunToolCall("draft_demo_ticket", { ticketId: "DEMO-1" });

    expect(ToolCallDryRunSchema.parse(toolCall)).toMatchObject({
      name: "draft_demo_ticket",
      dryRun: true,
      requiresApproval: false,
      riskLevel: "low",
    });
    expect(validateToolCalls([toolCall]).safe).toBe(true);
  });

  it("creates approval-required dry-run tool calls", () => {
    const toolCall = createApprovalRequiredToolCall(
      "update_demo_crm_record",
      { recordId: "DEMO-CRM-1" },
      "medium",
    );

    expect(ToolCallDryRunSchema.parse(toolCall)).toBeDefined();
    expect(toolCall).toMatchObject({
      dryRun: true,
      requiresApproval: true,
      riskLevel: "medium",
    });
    expect(validateToolCalls([toolCall]).safe).toBe(false);
  });

  it("creates unsafe synthetic policy-detection objects without executing anything", () => {
    const toolCall = createUnsafeSyntheticToolCall(
      "delete_demo_record",
      { recordId: "DEMO-RECORD-1" },
      "critical",
    );

    expect(ToolCallDryRunSchema.parse(toolCall)).toBeDefined();
    expect(toolCall).toMatchObject({
      dryRun: false,
      requiresApproval: true,
      riskLevel: "critical",
    });
    expect(toolCall.metadata).toMatchObject({
      executed: false,
      purpose: "local_policy_detection_demo",
    });
    expect(validateToolCalls([toolCall]).safe).toBe(false);
  });
});
