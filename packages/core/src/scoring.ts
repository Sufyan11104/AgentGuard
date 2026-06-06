import type { EvaluationResult, EvaluationSummary, FindingStatus, Severity } from "./schemas.js";

export const STATUS_SCORE: Record<FindingStatus, number> = {
  passed: 100,
  needs_review: 50,
  open: 0,
};

export const SEVERITY_WEIGHT: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function scoreResult(status: FindingStatus): number {
  return STATUS_SCORE[status];
}

export function summarizeResults(results: readonly EvaluationResult[]): EvaluationSummary {
  const severityCounts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  let weightedScore = 0;
  let totalWeight = 0;

  for (const result of results) {
    severityCounts[result.severity] += 1;
    const weight = SEVERITY_WEIGHT[result.severity];
    weightedScore += result.score * weight;
    totalWeight += weight;
  }

  const score = totalWeight === 0 ? 100 : Math.round(weightedScore / totalWeight);

  return {
    total: results.length,
    passed: results.filter((result) => result.status === "passed").length,
    failed: results.filter((result) => result.status === "open").length,
    needsReview: results.filter((result) => result.status === "needs_review").length,
    score,
    critical: severityCounts.critical,
    high: severityCounts.high,
    medium: severityCounts.medium,
    low: severityCounts.low,
  };
}
