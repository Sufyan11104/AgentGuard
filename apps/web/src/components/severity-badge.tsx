import { formatSeverity } from "@/lib/format";
import { Badge } from "./ui/badge";

const severityClasses: Record<string, string> = {
  low: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  medium: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  high: "border-orange-400/40 bg-orange-400/10 text-orange-200",
  critical: "border-red-400/50 bg-red-400/10 text-red-200",
};

export function SeverityBadge({ severity }: { readonly severity: string }) {
  return (
    <Badge className={severityClasses[severity] ?? "border-slate-600 bg-slate-800 text-slate-200"}>
      {formatSeverity(severity)}
    </Badge>
  );
}
