import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-accent/60 bg-accent px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-accent/20 hover:bg-accent/90",
  secondary:
    "border-slate-600 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800",
  danger:
    "border-red-400/50 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/25",
  ghost:
    "border-transparent bg-transparent px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/70",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly children: ReactNode;
}

export function Button({ className = "", variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex min-h-10 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  className = "",
  href,
  variant = "primary",
  children,
}: {
  readonly className?: string;
  readonly href: string;
  readonly variant?: ButtonVariant;
  readonly children: ReactNode;
}) {
  return (
    <a
      className={`focus-ring inline-flex min-h-10 items-center justify-center rounded-md border transition-colors ${variantClasses[variant]} ${className}`}
      href={href}
    >
      {children}
    </a>
  );
}
