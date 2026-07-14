import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      {/* Glowing AG mark */}
      <div
        className="mb-8 grid h-20 w-20 place-items-center rounded-2xl border border-accent/30 bg-accent/8 text-2xl font-black text-accent"
        style={{ boxShadow: "0 0 32px rgba(56,213,181,0.18)" }}
      >
        AG
      </div>

      <p className="text-sm font-semibold uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-3 text-4xl font-black text-slate-50 sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-sm text-base leading-7 text-slate-400">
        This route doesn&apos;t exist in AgentGuard. Head back to the dashboard or landing page.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard"
          className="focus-ring inline-flex min-h-10 items-center justify-center rounded-lg border border-accent/60 bg-accent px-5 py-2 text-sm font-bold text-slate-950 transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/20"
        >
          Go to dashboard
        </Link>
        <Link
          href="/"
          className="focus-ring inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-600 bg-slate-900 px-5 py-2 text-sm font-semibold text-slate-100 transition-all hover:border-slate-500 hover:bg-slate-800"
        >
          Go to home
        </Link>
      </div>
    </div>
  );
}
