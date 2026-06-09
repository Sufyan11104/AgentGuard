export interface NavigationItem {
  readonly label: string;
  readonly href: string;
}

export const primaryNavigation: readonly NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Projects", href: "/projects" },
  { label: "Reports", href: "/reports" },
  { label: "Docs", href: "/docs" },
] as const;
