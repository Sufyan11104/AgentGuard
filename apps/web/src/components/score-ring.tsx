import { formatScore } from "@/lib/format";

export function ScoreRing({
  score,
  size = "large",
}: {
  readonly score: number | null | undefined;
  readonly size?: "small" | "large";
}) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score ?? 0)));
  const compact = size === "small";

  return (
    <div
      aria-label={`Score ${formatScore(safeScore)}`}
      className={`grid shrink-0 place-items-center rounded-full border border-slate-700 bg-slate-950 ${
        compact ? "h-16 w-16" : "h-28 w-28"
      }`}
      style={{
        background: `conic-gradient(#38d5b5 ${safeScore}%, rgba(51,65,85,0.55) 0)`,
      }}
    >
      <div
        className={`grid place-items-center rounded-full bg-slate-950 text-center ${
          compact ? "h-12 w-12" : "h-20 w-20"
        }`}
      >
        <span
          className={
            compact ? "text-sm font-bold text-slate-50" : "text-xl font-bold text-slate-50"
          }
        >
          {safeScore}
        </span>
        {!compact ? <span className="text-xs text-slate-500">/100</span> : null}
      </div>
    </div>
  );
}
