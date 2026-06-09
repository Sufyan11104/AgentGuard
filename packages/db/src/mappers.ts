import type { Prisma } from "@prisma/client";
import {
  generateHtmlReport,
  generateJsonReport,
  generateMarkdownReport,
  type EvaluationResult,
  type EvaluationRun,
  type FindingStatus,
  type TestCategory,
} from "@agentguard/core";

export interface ReportDbInput {
  readonly runId: string;
  readonly format: "json" | "markdown" | "html";
  readonly title: string;
  readonly content: string;
}

export interface FindingDbInput {
  readonly runId: string;
  readonly resultId?: string;
  readonly title: string;
  readonly category: string;
  readonly severity: string;
  readonly status: string;
  readonly summary: string;
  readonly evidenceJson?: Prisma.InputJsonValue;
  readonly remediation: string;
}

const categoryLabels: Record<TestCategory, string> = {
  prompt_injection: "Prompt Injection",
  fake_secret_leakage: "Fake Secret Leakage",
  unsafe_tool_call: "Unsafe Tool Call",
  excessive_autonomy: "Excessive Autonomy",
  hallucinated_action: "Hallucinated Action",
  unsafe_output: "Unsafe Output",
  system_instruction_following: "System Instruction Following",
};

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function runStatusFromSummary(run: EvaluationRun): FindingStatus {
  if (run.summary.failed > 0) {
    return "open";
  }

  if (run.summary.needsReview > 0) {
    return "needs_review";
  }

  return "passed";
}

export function mapEvaluationRunToDbInput(
  run: EvaluationRun,
  projectId: string,
  targetId: string,
  config?: unknown,
): Prisma.EvaluationRunCreateManyInput {
  return {
    id: run.id,
    projectId,
    targetId,
    status: runStatusFromSummary(run),
    score: run.summary.score,
    startedAt: new Date(run.startedAt),
    completedAt: new Date(run.completedAt),
    summaryJson: toInputJson(run.summary),
    ...(config !== undefined ? { configJson: toInputJson(config) } : {}),
  };
}

export function mapEvaluationResultToDbInput(
  result: EvaluationResult,
  runId: string,
): Prisma.EvaluationResultCreateManyInput {
  return {
    runId,
    testCaseId: result.testCaseId,
    status: result.status,
    score: result.score,
    severity: result.severity,
    category: result.category,
    prompt: result.prompt,
    response: result.response,
    expectedBehaviour: result.expectedBehaviour,
    observedBehaviour: result.observedBehaviour,
    evidenceJson: toInputJson(result.evidence),
    reason: result.reason,
    remediation: result.remediation,
  };
}

export function mapFindingsFromResults(run: EvaluationRun): FindingDbInput[] {
  return run.results
    .filter((result) => result.status === "open" || result.status === "needs_review")
    .map((result) => ({
      runId: run.id,
      title: `${categoryLabels[result.category]} finding in ${result.testCaseId}`,
      category: result.category,
      severity: result.severity,
      status: result.status,
      summary: result.reason,
      evidenceJson: toInputJson(result.evidence),
      remediation: result.remediation,
    }));
}

export function mapReportsFromRun(run: EvaluationRun): ReportDbInput[] {
  return [
    {
      runId: run.id,
      format: "json",
      title: `AgentGuard JSON report for ${run.targetName}`,
      content: generateJsonReport(run),
    },
    {
      runId: run.id,
      format: "markdown",
      title: `AgentGuard Markdown report for ${run.targetName}`,
      content: generateMarkdownReport(run),
    },
    {
      runId: run.id,
      format: "html",
      title: `AgentGuard HTML report for ${run.targetName}`,
      content: generateHtmlReport(run),
    },
  ];
}
