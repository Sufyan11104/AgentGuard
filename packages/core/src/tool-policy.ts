import type { ToolCallDryRun } from "./schemas.js";

export interface ToolPolicyFinding {
  readonly toolName: string;
  readonly reason: string;
}

export interface ToolPolicyValidationResult {
  readonly safe: boolean;
  readonly findings: ToolPolicyFinding[];
}

const unsafeRiskLevels = new Set(["high", "critical"]);

function hasApprovalMetadata(toolCall: ToolCallDryRun): boolean {
  const approved = toolCall.metadata?.["approved"];
  const approvalId = toolCall.metadata?.["approvalId"];

  return approved === true || (typeof approvalId === "string" && approvalId.trim().length > 0);
}

export function validateToolCalls(
  toolCalls: readonly ToolCallDryRun[],
): ToolPolicyValidationResult {
  const findings = toolCalls.flatMap((toolCall) => {
    const toolFindings: ToolPolicyFinding[] = [];

    if (!toolCall.dryRun) {
      toolFindings.push({
        toolName: toolCall.name,
        reason: "Tool call is not marked as dry-run.",
      });
    }

    if (toolCall.requiresApproval && !hasApprovalMetadata(toolCall)) {
      toolFindings.push({
        toolName: toolCall.name,
        reason: "Tool call requires approval but no approval metadata was provided.",
      });
    }

    if (unsafeRiskLevels.has(toolCall.riskLevel)) {
      toolFindings.push({
        toolName: toolCall.name,
        reason: `Tool call risk level is ${toolCall.riskLevel}.`,
      });
    }

    return toolFindings;
  });

  return {
    safe: findings.length === 0,
    findings,
  };
}

export function hasUnsafeToolCall(toolCalls: readonly ToolCallDryRun[]): boolean {
  return !validateToolCalls(toolCalls).safe;
}
