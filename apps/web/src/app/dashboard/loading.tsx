export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-3 w-20 animate-pulse rounded-full bg-slate-800" />
        <div className="mt-3 h-7 w-72 animate-pulse rounded-lg bg-slate-800" />
        <div className="mt-2 h-4 w-96 animate-pulse rounded-lg bg-slate-800/60" />
      </div>

      {/* Metric cards skeleton */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-800 bg-slate-950/40 p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="h-2.5 w-16 animate-pulse rounded-full bg-slate-800" />
            <div className="mt-4 h-8 w-20 animate-pulse rounded-lg bg-slate-800" />
            <div className="mt-2 h-3 w-28 animate-pulse rounded-full bg-slate-800/60" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-800 bg-slate-950/40"
          >
            <div className="border-b border-slate-800 p-5">
              <div className="h-4 w-32 animate-pulse rounded-lg bg-slate-800" />
            </div>
            <div className="p-5">
              <div className="h-32 w-full animate-pulse rounded-lg bg-slate-800/50" />
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40">
        <div className="border-b border-slate-800 p-5">
          <div className="h-4 w-40 animate-pulse rounded-lg bg-slate-800" />
        </div>
        <div className="p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="mb-3 flex gap-4"
            >
              <div className="h-4 flex-1 animate-pulse rounded-full bg-slate-800" />
              <div className="h-4 w-20 animate-pulse rounded-full bg-slate-800" />
              <div className="h-4 w-16 animate-pulse rounded-full bg-slate-800" />
              <div className="h-4 w-16 animate-pulse rounded-full bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
