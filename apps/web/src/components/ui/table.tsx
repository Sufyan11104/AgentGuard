import type { ReactNode, TableHTMLAttributes } from "react";

export function Table({
  className = "",
  children,
  ...props
}: TableHTMLAttributes<HTMLTableElement> & { readonly children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full border-separate border-spacing-0 text-sm ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function Th({ children }: { readonly children: ReactNode }) {
  return (
    <th className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </th>
  );
}

export function Td({
  children,
  className = "",
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <td className={`border-b border-slate-900 px-4 py-3 align-top ${className}`}>{children}</td>
  );
}
