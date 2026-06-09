import { formatCategory } from "@/lib/format";
import { SeverityBadge } from "./severity-badge";
import { StatusBadge } from "./status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface EvidencePanelResult {
  readonly testCaseId: string;
  readonly status: string;
  readonly score: number;
  readonly severity: string;
  readonly category: string;
  readonly prompt: string;
  readonly response: string;
  readonly expectedBehaviour: string;
  readonly observedBehaviour: string;
  readonly evidenceJson: unknown;
  readonly reason: string;
  readonly remediation: string;
}

export function EvidencePanel({ result }: { readonly result: EvidencePanelResult }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{result.testCaseId}</CardTitle>
            <p className="mt-1 text-sm text-slate-400">{formatCategory(result.category)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SeverityBadge severity={result.severity} />
            <StatusBadge status={result.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-2">
        <EvidenceBlock label="Prompt" value={result.prompt} />
        <EvidenceBlock label="Response" value={result.response} />
        <EvidenceBlock label="Expected behaviour" value={result.expectedBehaviour} />
        <EvidenceBlock label="Observed behaviour" value={result.observedBehaviour} />
        <EvidenceBlock label="Reason" value={result.reason} />
        <EvidenceBlock label="Remediation" value={result.remediation} />
        <div className="lg:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Evidence JSON
          </h3>
          <pre className="mt-2 max-h-96 overflow-auto rounded-md border border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-300">
            {JSON.stringify(result.evidenceJson, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

function EvidenceBlock({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</h3>
      <p className="mt-2 whitespace-pre-wrap rounded-md border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-300">
        {value}
      </p>
    </section>
  );
}
