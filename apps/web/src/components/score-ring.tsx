import { formatScore } from "@/lib/format";

const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function scoreColor(score: number): string {
  if (score >= 80) return "#38d5b5"; // teal — safe
  if (score >= 50) return "#f6c756"; // amber — warning
  return "#ff6b6b"; // red — danger
}

export function ScoreRing({
  score,
  size = "large",
  label,
}: {
  readonly score: number | null | undefined;
  readonly size?: "small" | "large";
  readonly label?: string;
}) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score ?? 0)));
  const compact = size === "small";

  const strokeWidth = compact ? 5 : 6;
  const svgSize = compact ? 64 : 112;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const r = compact ? 26 : RADIUS;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (safeScore / 100) * circumference;
  const color = scoreColor(safeScore);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        aria-label={`Score ${formatScore(safeScore)}`}
        className="relative shrink-0"
        style={{ width: svgSize, height: svgSize }}
      >
        <svg
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          width={svgSize}
          height={svgSize}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(51,65,85,0.5)"
            strokeWidth={strokeWidth}
          />
          {/* Progress — animated */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1), stroke 0.4s ease",
              filter: `drop-shadow(0 0 6px ${color}60)`,
            }}
          />
        </svg>

        {/* Centre label */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <span
            className={`font-black leading-none tabular-nums ${compact ? "text-lg" : "text-2xl"}`}
            style={{ color }}
          >
            {safeScore}
          </span>
          {!compact && (
            <span className="mt-0.5 text-[11px] font-medium text-slate-500">/ 100</span>
          )}
        </div>
      </div>

      {label !== undefined && (
        <span className="text-center text-xs font-medium text-slate-400">{label}</span>
      )}
    </div>
  );
}
