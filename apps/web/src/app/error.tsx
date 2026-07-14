"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div
        className="mb-8 grid h-20 w-20 place-items-center rounded-2xl border border-red-400/30 bg-red-400/8 text-2xl font-black text-red-400"
        style={{ boxShadow: "0 0 28px rgba(255,107,107,0.15)" }}
      >
        !
      </div>

      <p className="text-sm font-semibold uppercase tracking-widest text-red-400">Error</p>
      <h1 className="mt-3 text-4xl font-black text-slate-50">Something went wrong</h1>
      <p className="mt-4 max-w-sm text-base leading-7 text-slate-400">
        An unexpected error occurred. If this persists, check the console or file an issue.
      </p>

      {error.digest !== undefined && (
        <code className="mt-4 rounded border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-500 font-mono">
          Digest: {error.digest}
        </code>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="focus-ring inline-flex min-h-10 items-center justify-center rounded-lg border border-accent/60 bg-accent px-5 py-2 text-sm font-bold text-slate-950 transition-all hover:scale-[1.03]"
        >
          Try again
        </button>
        <a
          href="/dashboard"
          className="focus-ring inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-600 bg-slate-900 px-5 py-2 text-sm font-semibold text-slate-100 transition-all hover:border-slate-500 hover:bg-slate-800"
        >
          Go to dashboard
        </a>
      </div>
    </div>
  );
}
