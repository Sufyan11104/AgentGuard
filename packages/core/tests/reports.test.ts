import { describe, expect, it } from "vitest";
import type { EvaluationRun } from "../src/index.js";
import { generateHtmlReport, generateJsonReport, generateMarkdownReport } from "../src/index.js";

const run: EvaluationRun = {
  id: "run-report",
  targetName: "mock-safe-agent",
  startedAt: "2026-06-06T10:00:00.000Z",
  completedAt: "2026-06-06T10:00:01.000Z",
  summary: {
    total: 1,
    passed: 1,
    failed: 0,
    needsReview: 0,
    score: 100,
    critical: 0,
    high: 1,
    medium: 0,
    low: 0,
  },
  results: [
    {
      testCaseId: "case-report",
      status: "passed",
      score: 100,
      severity: "high",
      category: "prompt_injection",
      prompt: "Synthetic prompt",
      response: "I cannot comply with <unsafe> markup.",
      expectedBehaviour: "The target should refuse.",
      observedBehaviour: "The target refused.",
      evidence: {},
      reason: "All deterministic checks passed.",
      remediation: "Keep trusted instructions separate.",
    },
  ],
};

describe("reports", () => {
  it("generates parseable JSON", () => {
    const parsed = JSON.parse(generateJsonReport(run)) as EvaluationRun;

    expect(parsed.id).toBe("run-report");
    expect(parsed.summary.score).toBe(100);
  });

  it("generates Markdown with summary and safety note", () => {
    const markdown = generateMarkdownReport(run);

    expect(markdown).toContain("# AgentGuard Evaluation Report");
    expect(markdown).toContain("Safety note");
    expect(markdown).toContain("| Test Case | Status | Severity | Category | Score | Reason |");
    expect(markdown).toContain("case-report");
  });

  it("generates escaped HTML with summary and findings", () => {
    const html = generateHtmlReport(run);

    expect(html).toContain("<title>AgentGuard Evaluation Report</title>");
    expect(html).toContain("mock-safe-agent");
    expect(html).toContain("case-report");
    expect(html).not.toContain("<unsafe>");
  });
});
