import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { readonly children: ReactNode }) {
  return (
    <div
      className={`rounded-lg border border-slate-700/80 bg-slate-950/45 shadow-sm shadow-black/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
}: {
  readonly className?: string;
  readonly children: ReactNode;
}) {
  return <div className={`border-b border-slate-800 px-5 py-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children }: { readonly children: ReactNode }) {
  return <h2 className="text-base font-semibold text-slate-50">{children}</h2>;
}

export function CardDescription({ children }: { readonly children: ReactNode }) {
  return <p className="mt-1 text-sm leading-6 text-slate-400">{children}</p>;
}

export function CardContent({
  className = "",
  children,
}: {
  readonly className?: string;
  readonly children: ReactNode;
}) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
