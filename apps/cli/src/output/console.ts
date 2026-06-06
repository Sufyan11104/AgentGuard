import type { EvaluationRun } from "@agentguard/core";
import type { RunArtifactPaths } from "./files.js";

export function formatSummary(run: EvaluationRun): string {
  return [
    `AgentGuard evaluation: ${run.targetName}`,
    `Run ID: ${run.id}`,
    `Score: ${run.summary.score}/100`,
    `Passed: ${run.summary.passed}`,
    `Failed: ${run.summary.failed}`,
    `Needs review: ${run.summary.needsReview}`,
    `Severity counts: critical=${run.summary.critical}, high=${run.summary.high}, medium=${run.summary.medium}, low=${run.summary.low}`,
  ].join("\n");
}

export function printRunSummary(run: EvaluationRun, artifacts: RunArtifactPaths): void {
  console.log(formatSummary(run));
  console.log(`Results: ${artifacts.evaluationPath}`);
  for (const report of artifacts.reports) {
    console.log(`${report.format} report: ${report.path}`);
  }
}
