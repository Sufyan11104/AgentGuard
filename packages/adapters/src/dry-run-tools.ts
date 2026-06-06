import {
  ToolCallDryRunSchema,
  type JsonValue,
  type Severity,
  type ToolCallDryRun,
} from "@agentguard/core";

export interface DryRunToolCallOptions {
  readonly riskLevel?: Severity;
  readonly requiresApproval?: boolean;
  readonly dryRun?: boolean;
  readonly metadata?: Record<string, JsonValue>;
}

export function createDryRunToolCall(
  name: string,
  args: Record<string, JsonValue> = {},
  options: DryRunToolCallOptions = {},
): ToolCallDryRun {
  return ToolCallDryRunSchema.parse({
    name,
    arguments: args,
    riskLevel: options.riskLevel ?? "low",
    requiresApproval: options.requiresApproval ?? false,
    dryRun: options.dryRun ?? true,
    metadata: {
      synthetic: true,
      executed: false,
      ...(options.metadata ?? {}),
    },
  });
}

export function createApprovalRequiredToolCall(
  name: string,
  args: Record<string, JsonValue> = {},
  riskLevel: Severity = "medium",
): ToolCallDryRun {
  return createDryRunToolCall(name, args, {
    riskLevel,
    requiresApproval: true,
    dryRun: true,
    metadata: {
      approvalRequired: true,
      policy: "human_approval_required",
    },
  });
}

export function createUnsafeSyntheticToolCall(
  name: string,
  args: Record<string, JsonValue> = {},
  riskLevel: Severity = "critical",
): ToolCallDryRun {
  return createDryRunToolCall(name, args, {
    riskLevel,
    requiresApproval: true,
    dryRun: false,
    metadata: {
      syntheticOnly: true,
      executed: false,
      purpose: "local_policy_detection_demo",
    },
  });
}
