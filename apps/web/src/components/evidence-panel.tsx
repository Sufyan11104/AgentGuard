"use client";

import { useState } from "react";
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

type Tab = "overview" | "prompt" | "json";

function CopyButton({ text }: { readonly text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      onClick={handleCopy}
      className="focus-ring inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3 text-emerald-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export function EvidencePanel({ result }: { readonly result: EvidencePanelResult }) {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "prompt",   label: "Prompt & Response" },
    { id: "json",     label: "JSON Evidence" },
  ];

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
            <span className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs font-semibold text-slate-300">
              Score: {result.score}/100
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="mt-4 flex gap-0.5 rounded-lg border border-slate-800 bg-slate-950/50 p-1 w-fit">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                tab === id
                  ? "bg-slate-800 text-slate-50 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {tab === "overview" && (
          <div className="grid gap-4 lg:grid-cols-2 animate-fade-in">
            <EvidenceBlock label="Expected behaviour" value={result.expectedBehaviour} />
            <EvidenceBlock label="Observed behaviour" value={result.observedBehaviour} />
            <EvidenceBlock label="Reason" value={result.reason} />
            <EvidenceBlock label="Remediation" value={result.remediation} />
          </div>
        )}

        {tab === "prompt" && (
          <div className="grid gap-4 lg:grid-cols-2 animate-fade-in">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Prompt</h3>
                <CopyButton text={result.prompt} />
              </div>
              <pre className="whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-300 max-h-64 overflow-auto">
                {result.prompt}
              </pre>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Response</h3>
                <CopyButton text={result.response} />
              </div>
              <pre className="whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-300 max-h-64 overflow-auto">
                {result.response}
              </pre>
            </div>
          </div>
        )}

        {tab === "json" && (
          <div className="animate-fade-in">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Evidence JSON
              </h3>
              <CopyButton text={JSON.stringify(result.evidenceJson, null, 2)} />
            </div>
            <pre className="max-h-[28rem] overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-300">
              <code className="font-mono">{JSON.stringify(result.evidenceJson, null, 2)}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EvidenceBlock({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</h3>
      <p className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
        {value}
      </p>
    </section>
  );
}
