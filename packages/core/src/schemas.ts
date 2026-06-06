import { z } from "zod";

export const SeveritySchema = z.enum(["low", "medium", "high", "critical"]);
export type Severity = z.infer<typeof SeveritySchema>;

export const FindingStatusSchema = z.enum(["open", "passed", "needs_review"]);
export type FindingStatus = z.infer<typeof FindingStatusSchema>;

export const TestCategorySchema = z.enum([
  "prompt_injection",
  "fake_secret_leakage",
  "unsafe_tool_call",
  "excessive_autonomy",
  "hallucinated_action",
  "unsafe_output",
  "system_instruction_following",
]);
export type TestCategory = z.infer<typeof TestCategorySchema>;

export const ToolRiskLevelSchema = SeveritySchema;
export type ToolRiskLevel = z.infer<typeof ToolRiskLevelSchema>;

export const JsonPrimitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export type JsonPrimitive = z.infer<typeof JsonPrimitiveSchema>;

export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([JsonPrimitiveSchema, z.array(JsonValueSchema), z.record(z.string(), JsonValueSchema)]),
);

export const ToolCallDryRunSchema = z
  .object({
    name: z.string().min(1, "Tool call name is required."),
    arguments: z.record(z.string(), JsonValueSchema).default({}),
    riskLevel: ToolRiskLevelSchema,
    requiresApproval: z.boolean(),
    dryRun: z.boolean(),
    metadata: z.record(z.string(), JsonValueSchema).optional(),
  })
  .strict();
export type ToolCallDryRun = z.infer<typeof ToolCallDryRunSchema>;

export const TargetResponseSchema = z
  .object({
    text: z.string(),
    toolCalls: z.array(ToolCallDryRunSchema).optional(),
    metadata: z.record(z.string(), JsonValueSchema).optional(),
  })
  .strict();
export type TargetResponse = z.infer<typeof TargetResponseSchema>;

export const AssertionTypeSchema = z.enum([
  "must_not_contain",
  "must_contain",
  "should_refuse",
  "must_not_call_tool",
  "requires_human_approval",
  "must_not_claim_action_completed",
]);
export type AssertionType = z.infer<typeof AssertionTypeSchema>;

export const TestAssertionSchema = z
  .object({
    type: AssertionTypeSchema,
    value: z.string().optional(),
    description: z.string().min(1, "Assertion description is required."),
  })
  .strict();
export type TestAssertion = z.infer<typeof TestAssertionSchema>;

export const TestCaseSchema = z
  .object({
    id: z.string().min(1, "Test case id is required."),
    title: z.string().min(1, "Test case title is required."),
    category: TestCategorySchema,
    severity: SeveritySchema,
    input: z.string().min(1, "Test case input is required."),
    expectedBehaviour: z.string().min(1, "Expected behaviour is required."),
    assertions: z.array(TestAssertionSchema).min(1, "At least one assertion is required."),
    remediation: z.string().min(1, "Remediation guidance is required."),
    tags: z.array(z.string()).default([]),
  })
  .strict();
export type TestCase = z.infer<typeof TestCaseSchema>;

export const TestPackSchema = z
  .object({
    id: z.string().min(1, "Test pack id is required."),
    name: z.string().min(1, "Test pack name is required."),
    description: z.string().min(1, "Test pack description is required."),
    version: z.string().min(1, "Test pack version is required."),
    safetyNotes: z.string().min(1, "Safety notes are required."),
    testCases: z.array(TestCaseSchema).min(1, "At least one test case is required."),
  })
  .strict();
export type TestPack = z.infer<typeof TestPackSchema>;

export const EvidenceSchema = z.record(z.string(), JsonValueSchema);
export type Evidence = z.infer<typeof EvidenceSchema>;

export const EvaluationResultSchema = z
  .object({
    testCaseId: z.string().min(1),
    status: FindingStatusSchema,
    score: z.number().min(0).max(100),
    severity: SeveritySchema,
    category: TestCategorySchema,
    prompt: z.string(),
    response: z.string(),
    expectedBehaviour: z.string(),
    observedBehaviour: z.string(),
    evidence: EvidenceSchema,
    reason: z.string(),
    remediation: z.string(),
  })
  .strict();
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;

export const EvaluationSummarySchema = z
  .object({
    total: z.number().int().min(0),
    passed: z.number().int().min(0),
    failed: z.number().int().min(0),
    needsReview: z.number().int().min(0),
    score: z.number().min(0).max(100),
    critical: z.number().int().min(0),
    high: z.number().int().min(0),
    medium: z.number().int().min(0),
    low: z.number().int().min(0),
  })
  .strict();
export type EvaluationSummary = z.infer<typeof EvaluationSummarySchema>;

export const EvaluationRunSchema = z
  .object({
    id: z.string().min(1),
    targetName: z.string().min(1),
    startedAt: z.string().datetime(),
    completedAt: z.string().datetime(),
    results: z.array(EvaluationResultSchema),
    summary: EvaluationSummarySchema,
  })
  .strict();
export type EvaluationRun = z.infer<typeof EvaluationRunSchema>;

export function parseTestPack(input: unknown): TestPack {
  return TestPackSchema.parse(input);
}

export function parseEvaluationRun(input: unknown): EvaluationRun {
  return EvaluationRunSchema.parse(input);
}
