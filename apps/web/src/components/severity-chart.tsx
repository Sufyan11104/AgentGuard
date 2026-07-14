const SEVERITY_CONFIG = [
  { key: "critical", label: "Critical", color: "#ff6b6b", track: "rgba(255,107,107,0.15)" },
  { key: "high",     label: "High",     color: "#fb923c", track: "rgba(251,146,60,0.15)" },
  { key: "medium",   label: "Medium",   color: "#f6c756", track: "rgba(246,199,86,0.15)" },
  { key: "low",      label: "Low",      color: "#38d5b5", track: "rgba(56,213,181,0.15)" },
] as const;

export interface SeverityBreakdown {
  readonly critical: number;
  readonly high: number;
  readonly medium: number;
  readonly low: number;
}

export function SeverityChart({ counts }: { readonly counts: SeverityBreakdown }) {
  const total = counts.critical + counts.high + counts.medium + counts.low;

  if (total === 0) {
    return (
      <p className="text-sm text-slate-400">No findings recorded yet.</p>
    );
  }

  return (
    <div className="grid gap-3">
      {SEVERITY_CONFIG.map(({ key, label, color, track }) => {
        const count = counts[key];
        const pct = total > 0 ? (count / total) * 100 : 0;

        return (
          <div key={key} className="grid grid-cols-[72px_1fr_32px] items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">{label}</span>

            {/* Bar track */}
            <div className="relative h-2 overflow-hidden rounded-full" style={{ background: track }}>
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: color,
                  boxShadow: `0 0 6px ${color}60`,
                  transition: "width 1.1s cubic-bezier(.4,0,.2,1)",
                }}
              />
            </div>

            <span
              className="text-right text-xs font-bold tabular-nums"
              style={{ color: count > 0 ? color : "#475569" }}
            >
              {count}
            </span>
          </div>
        );
      })}

      {/* Total label */}
      <p className="mt-1 text-right text-[11px] text-slate-600">
        {total} finding{total !== 1 ? "s" : ""} total
      </p>
    </div>
  );
}
