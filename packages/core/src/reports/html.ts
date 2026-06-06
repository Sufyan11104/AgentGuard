import type { EvaluationRun } from "../schemas.js";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function generateHtmlReport(run: EvaluationRun): string {
  const rows = run.results
    .map(
      (result) => `<tr>
  <td>${escapeHtml(result.testCaseId)}</td>
  <td>${escapeHtml(result.status)}</td>
  <td>${escapeHtml(result.severity)}</td>
  <td>${escapeHtml(result.category)}</td>
  <td>${result.score}</td>
  <td>${escapeHtml(result.reason)}</td>
</tr>`,
    )
    .join("\n");

  const details = run.results
    .map(
      (result) => `<section class="result">
  <h3>${escapeHtml(result.testCaseId)}</h3>
  <dl>
    <dt>Status</dt><dd>${escapeHtml(result.status)}</dd>
    <dt>Severity</dt><dd>${escapeHtml(result.severity)}</dd>
    <dt>Category</dt><dd>${escapeHtml(result.category)}</dd>
    <dt>Score</dt><dd>${result.score}</dd>
    <dt>Expected behaviour</dt><dd>${escapeHtml(result.expectedBehaviour)}</dd>
    <dt>Observed behaviour</dt><dd>${escapeHtml(result.observedBehaviour)}</dd>
    <dt>Reason</dt><dd>${escapeHtml(result.reason)}</dd>
    <dt>Remediation</dt><dd>${escapeHtml(result.remediation)}</dd>
  </dl>
</section>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AgentGuard Evaluation Report</title>
  <style>
    body { color: #172026; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.5; margin: 0; background: #f7f8f8; }
    main { margin: 0 auto; max-width: 1100px; padding: 40px 24px; }
    h1, h2, h3 { color: #11181c; line-height: 1.2; }
    .safety { background: #fff8e1; border: 1px solid #f0d48a; border-radius: 8px; padding: 14px 16px; }
    .summary { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); margin: 24px 0; }
    .metric, .result { background: #ffffff; border: 1px solid #dde3e6; border-radius: 8px; padding: 16px; }
    .metric strong { display: block; font-size: 28px; }
    table { background: #ffffff; border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #dde3e6; padding: 10px; text-align: left; vertical-align: top; }
    th { background: #eef2f3; }
    dl { display: grid; gap: 8px 16px; grid-template-columns: 180px 1fr; }
    dt { color: #52636b; font-weight: 700; }
    dd { margin: 0; }
  </style>
</head>
<body>
  <main>
    <h1>AgentGuard Evaluation Report</h1>
    <p class="safety">Safety note: AgentGuard reports are intended for defensive testing of systems you own or have permission to test. Built-in checks use synthetic canaries and dry-run tool-call evidence.</p>

    <h2>Target</h2>
    <p><strong>Name:</strong> ${escapeHtml(run.targetName)}<br>
    <strong>Started:</strong> ${escapeHtml(run.startedAt)}<br>
    <strong>Completed:</strong> ${escapeHtml(run.completedAt)}</p>

    <h2>Summary</h2>
    <section class="summary">
      <div class="metric"><span>Total</span><strong>${run.summary.total}</strong></div>
      <div class="metric"><span>Passed</span><strong>${run.summary.passed}</strong></div>
      <div class="metric"><span>Failed</span><strong>${run.summary.failed}</strong></div>
      <div class="metric"><span>Needs review</span><strong>${run.summary.needsReview}</strong></div>
      <div class="metric"><span>Score</span><strong>${run.summary.score}</strong></div>
      <div class="metric"><span>Critical</span><strong>${run.summary.critical}</strong></div>
      <div class="metric"><span>High</span><strong>${run.summary.high}</strong></div>
      <div class="metric"><span>Medium</span><strong>${run.summary.medium}</strong></div>
      <div class="metric"><span>Low</span><strong>${run.summary.low}</strong></div>
    </section>

    <h2>Finding Table</h2>
    <table>
      <thead>
        <tr>
          <th>Test Case</th>
          <th>Status</th>
          <th>Severity</th>
          <th>Category</th>
          <th>Score</th>
          <th>Reason</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="6">No results were recorded.</td></tr>`}
      </tbody>
    </table>

    <h2>Individual Results</h2>
    ${details || "<p>No individual results were recorded.</p>"}
  </main>
</body>
</html>
`;
}
