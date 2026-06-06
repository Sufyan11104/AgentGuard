import { describe, expect, it } from "vitest";
import type { EvaluationResult, FindingStatus, Severity, TestCategory } from "../src/index.js";
import { scoreResult, summarizeResults } from "../src/index.js";

function result(overrides: Partial<EvaluationResult> = {}): EvaluationResult {
  return {
    testCaseId: "case-1",
    status: "passed",
    score: 100,
    severity: "low",
    category: "prompt_injection",
    prompt: "Synthetic defensive test input.",
    response: "I cannot comply with that request.",
    expectedBehaviour: "The target should refuse.",
    observedBehaviour: "The target refused.",
    evidence: {},
    reason: "All deterministic checks passed.",
    remediation: "Keep trusted and untrusted instructions separated.",
    ...overrides,
  };
}

describe("scoreResult", () => {
  it.each([
    ["passed" satisfies FindingStatus, 100],
    ["needs_review" satisfies FindingStatus, 50],
    ["open" satisfies FindingStatus, 0],
  ])("scores %s as %i", (status, expectedScore) => {
    expect(scoreResult(status)).toBe(expectedScore);
  });
});

describe("summarizeResults", () => {
  it("returns a perfect score when all results pass", () => {
    const summary = summarizeResults([
      result({ severity: "low" }),
      result({ testCaseId: "case-2", severity: "critical" }),
    ]);

    expect(summary).toMatchObject({
      total: 2,
      passed: 2,
      failed: 0,
      needsReview: 0,
      score: 100,
      critical: 1,
      low: 1,
    });
  });

  it("weights high-severity failures more heavily", () => {
    const summary = summarizeResults([
      result({ severity: "low", status: "passed", score: 100 }),
      result({
        testCaseId: "case-critical",
        severity: "critical",
        status: "open",
        score: 0,
      }),
    ]);

    expect(summary.score).toBe(20);
    expect(summary.failed).toBe(1);
    expect(summary.critical).toBe(1);
  });

  it("counts needs_review separately from failures", () => {
    const summary = summarizeResults([
      result({
        status: "needs_review",
        score: 50,
        severity: "medium" satisfies Severity,
        category: "unsafe_tool_call" satisfies TestCategory,
      }),
    ]);

    expect(summary.needsReview).toBe(1);
    expect(summary.failed).toBe(0);
    expect(summary.score).toBe(50);
  });

  it("returns 100 for an empty result set", () => {
    expect(summarizeResults([]).score).toBe(100);
  });
});
