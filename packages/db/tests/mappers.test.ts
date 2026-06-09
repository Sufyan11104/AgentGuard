import { describe, expect, it } from "vitest";
import type { EvaluationRun } from "@agentguard/core";
import {
  mapEvaluationResultToDbInput,
  mapEvaluationRunToDbInput,
  mapFindingsFromResults,
  mapReportsFromRun,
} from "../src/index.js";

function sampleRun(): EvaluationRun {
  return {
    id: "test-run-1",
    targetName: "Mock Target",
    startedAt: "2026-06-06T10:00:00.000Z",
    completedAt: "2026-06-06T10:00:01.000Z",
    summary: {
      total: 3,
      passed: 1,
      failed: 1,
      needsReview: 1,
      score: 33,
      critical: 1,
      high: 1,
      medium: 1,
      low: 0,
    },
    results: [
      {
        testCaseId: "case-pass",
        status: "passed",
        score: 100,
        severity: "medium",
        category: "system_instruction_following",
        prompt: "Local safe prompt",
        response: "I cannot comply.",
        expectedBehaviour: "Refuse safely.",
        observedBehaviour: "Refused safely.",
        evidence: { ok: true },
        reason: "All deterministic checks passed.",
        remediation: "Keep policy boundaries explicit.",
      },
      {
        testCaseId: "case-open",
        status: "open",
        score: 0,
        severity: "critical",
        category: "prompt_injection",
        prompt: "Local unsafe override prompt",
        response: "Synthetic override accepted.",
        expectedBehaviour: "Reject override.",
        observedBehaviour: "Accepted override.",
        evidence: { failed: true },
        reason: "Response accepted a synthetic override.",
        remediation: "Separate trusted and untrusted context.",
      },
      {
        testCaseId: "case-review",
        status: "needs_review",
        score: 50,
        severity: "high",
        category: "unsafe_tool_call",
        prompt: "Local approval prompt",
        response: "Needs review.",
        expectedBehaviour: "Approval should be visible.",
        observedBehaviour: "Approval path needs review.",
        evidence: { review: true },
        reason: "Approval path needs human review.",
        remediation: "Add explicit approval metadata.",
      },
    ],
  };
}

describe("db mappers", () => {
  it("maps evaluation run summary and status", () => {
    const mapped = mapEvaluationRunToDbInput(sampleRun(), "project-1", "target-1", {
      source: "test",
    });

    expect(mapped).toMatchObject({
      id: "test-run-1",
      projectId: "project-1",
      targetId: "target-1",
      status: "open",
      score: 33,
    });
    expect(mapped.startedAt).toEqual(new Date("2026-06-06T10:00:00.000Z"));
    expect(mapped.summaryJson).toMatchObject({ total: 3, score: 33 });
    expect(mapped.configJson).toMatchObject({ source: "test" });
  });

  it("maps individual evaluation results", () => {
    const result = sampleRun().results[1];
    expect(result).toBeDefined();

    const mapped = mapEvaluationResultToDbInput(result!, "test-run-1");

    expect(mapped).toMatchObject({
      runId: "test-run-1",
      testCaseId: "case-open",
      status: "open",
      score: 0,
      severity: "critical",
      category: "prompt_injection",
    });
    expect(mapped.evidenceJson).toMatchObject({ failed: true });
  });

  it("creates findings only for open and needs_review results", () => {
    const findings = mapFindingsFromResults(sampleRun());

    expect(findings).toHaveLength(2);
    expect(findings.map((finding) => finding.title)).toEqual([
      "Prompt Injection finding in case-open",
      "Unsafe Tool Call finding in case-review",
    ]);
    expect(findings.map((finding) => finding.status)).toEqual(["open", "needs_review"]);
  });

  it("maps JSON, Markdown, and HTML reports", () => {
    const reports = mapReportsFromRun(sampleRun());

    expect(reports.map((report) => report.format)).toEqual(["json", "markdown", "html"]);
    expect(reports[0]?.content).toContain('"id": "test-run-1"');
    expect(reports[1]?.content).toContain("# AgentGuard Evaluation Report");
    expect(reports[2]?.content).toContain("<title>AgentGuard Evaluation Report</title>");
  });
});
