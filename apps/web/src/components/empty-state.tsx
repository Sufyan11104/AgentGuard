import type { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";

export function EmptyState({
  title,
  description,
  action,
}: {
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-xl border border-accent/20 bg-accent/8 text-accent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-50">{title}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
        {action !== undefined ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
