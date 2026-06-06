import type { EvaluationResult, EvaluationRun } from "../schemas.js";

function escapePipe(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function resultRow(result: EvaluationResult): string {
  return [
    result.testCaseId,
    result.status,
    result.severity,
    result.category,
    String(result.score),
    result.reason,
  ]
    .map(escapePipe)
    .join(" | ");
}

export function generateMarkdownReport(run: EvaluationRun): string {
  const findingRows =
    run.results.length === 0
      ? "_No results were recorded._"
      : [
          "| Test Case | Status | Severity | Category | Score | Reason |",
          "| --- | --- | --- | --- | ---: | --- |",
          ...run.results.map((result) => `| ${resultRow(result)} |`),
        ].join("\n");

  const resultDetails = run.results
    .map(
      (result) => `### ${result.testCaseId}

- Status: ${result.status}
- Severity: ${result.severity}
- Category: ${result.category}
- Score: ${result.score}
- Expected behaviour: ${result.expectedBehaviour}
- Observed behaviour: ${result.observedBehaviour}
- Reason: ${result.reason}
- Remediation: ${result.remediation}

`,
    )
    .join("\n");

  return `# AgentGuard Evaluation Report

Safety note: AgentGuard reports are intended for defensive testing of systems you own or have permission to test. Built-in checks use synthetic canaries and dry-run tool-call evidence.

## Target

- Name: ${run.targetName}
- Started: ${run.startedAt}
- Completed: ${run.completedAt}

## Summary

- Total: ${run.summary.total}
- Passed: ${run.summary.passed}
- Failed: ${run.summary.failed}
- Needs review: ${run.summary.needsReview}
- Score: ${run.summary.score}
- Critical: ${run.summary.critical}
- High: ${run.summary.high}
- Medium: ${run.summary.medium}
- Low: ${run.summary.low}

## Finding Table

${findingRows}

## Individual Results

${resultDetails || "_No individual results were recorded._"}
`;
}
