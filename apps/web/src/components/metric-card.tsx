import type { ReactNode } from "react";

type MetricVariant = "default" | "success" | "danger" | "warning";

const variantStyles: Record<MetricVariant, string> = {
  default: "border-slate-700/60",
  success: "border-emerald-400/30 shadow-emerald-400/5",
  danger:  "border-red-400/30 shadow-red-400/5",
  warning: "border-amber-400/30 shadow-amber-400/5",
};

const variantAccent: Record<MetricVariant, string> = {
  default: "text-slate-50",
  success: "text-emerald-300",
  danger:  "text-red-300",
  warning: "text-amber-300",
};

export function MetricCard({
  label,
  value,
  detail,
  variant = "default",
  trend,
}: {
  readonly label: string;
  readonly value: ReactNode;
  readonly detail?: string;
  readonly variant?: MetricVariant;
  readonly trend?: "up" | "down" | "neutral";
}) {
  return (
    <div
      className={`animate-fade-slide-up rounded-xl border bg-slate-950/50 p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${variantStyles[variant]}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</p>
      <div className="mt-3 flex items-end gap-2">
        <div className={`text-3xl font-black tabular-nums leading-none ${variantAccent[variant]}`}>
          {value}
        </div>
        {trend !== undefined && (
          <span
            className={`mb-0.5 text-sm font-semibold ${
              trend === "up"
                ? "text-emerald-400"
                : trend === "down"
                  ? "text-red-400"
                  : "text-slate-500"
            }`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"}
          </span>
        )}
      </div>
      {detail !== undefined ? (
        <p className="mt-2 text-xs text-slate-500">{detail}</p>
      ) : null}
    </div>
  );
}
