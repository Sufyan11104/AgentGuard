const W = 240;
const H = 56;
const PAD = 4;

function buildPath(points: readonly number[]): { line: string; area: string } {
  if (points.length < 2) return { line: "", area: "" };

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((v, i) => {
    const x = PAD + (i / (points.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
    return [x, y] as const;
  });

  const lineParts = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  const line = lineParts.join(" ");
  const area = `${line} L${coords[coords.length - 1]![0].toFixed(1)},${H} L${coords[0]![0].toFixed(1)},${H} Z`;

  return { line, area };
}

export function Sparkline({
  values,
  label,
  color = "#38d5b5",
}: {
  readonly values: readonly number[];
  readonly label?: string;
  readonly color?: string;
}) {
  if (values.length < 2) {
    return (
      <p className="text-xs text-slate-500">Not enough data for trend.</p>
    );
  }

  const { line, area } = buildPath(values);
  const latest = values[values.length - 1] ?? 0;
  const prev = values[values.length - 2] ?? latest;
  const delta = latest - prev;

  return (
    <div className="flex items-center gap-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        className="shrink-0 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`sparkGrad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d={area}
          fill={`url(#sparkGrad-${color.replace("#", "")})`}
        />

        {/* Line */}
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 3px ${color}80)` }}
        />

        {/* Latest point dot */}
        {values.length > 0 && (() => {
          const lastX = PAD + W - PAD * 2;
          const min = Math.min(...values);
          const max = Math.max(...values);
          const range = max - min || 1;
          const lastY = H - PAD - ((latest - min) / range) * (H - PAD * 2);
          return (
            <circle cx={lastX.toFixed(1)} cy={lastY.toFixed(1)} r={3} fill={color} />
          );
        })()}
      </svg>

      <div className="shrink-0 text-right">
        <div className="text-lg font-black tabular-nums" style={{ color }}>
          {latest}/100
        </div>
        {delta !== 0 && (
          <div
            className={`text-xs font-semibold ${delta > 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {delta > 0 ? "+" : ""}{delta} last run
          </div>
        )}
        {label !== undefined && (
          <div className="mt-0.5 text-[11px] text-slate-500">{label}</div>
        )}
      </div>
    </div>
  );
}
