import { formatStatus } from "@/lib/format";
import { Badge } from "./ui/badge";

const statusClasses: Record<string, string> = {
  passed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  open: "border-red-400/50 bg-red-400/10 text-red-200",
  needs_review: "border-amber-400/40 bg-amber-400/10 text-amber-200",
};

export function StatusBadge({ status }: { readonly status: string }) {
  return (
    <Badge className={statusClasses[status] ?? "border-slate-600 bg-slate-800 text-slate-200"}>
      {formatStatus(status)}
    </Badge>
  );
}
