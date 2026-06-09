import type { ReactNode } from "react";

export interface TabItem {
  readonly id: string;
  readonly label: string;
  readonly content: ReactNode;
}

export function Tabs({ items }: { readonly items: readonly TabItem[] }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Report formats">
        {items.map((item, index) => (
          <a
            className={`focus-ring rounded-md border px-3 py-2 text-sm font-medium ${
              index === 0
                ? "border-accent/60 bg-accent/10 text-accent"
                : "border-slate-700 bg-slate-950/40 text-slate-300 hover:bg-slate-900"
            }`}
            href={`#${item.id}`}
            key={item.id}
            role="tab"
          >
            {item.label}
          </a>
        ))}
      </div>
      <div className="space-y-5">
        {items.map((item) => (
          <section
            aria-label={item.label}
            className="rounded-lg border border-slate-800 bg-slate-950/40"
            id={item.id}
            key={item.id}
          >
            {item.content}
          </section>
        ))}
      </div>
    </div>
  );
}
