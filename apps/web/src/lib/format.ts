import type { FindingStatus, Severity, TestCategory } from "@agentguard/core";

export function formatNumber(value: number | null | undefined): string {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value ?? 0);
}

export function formatScore(score: number | null | undefined): string {
  return `${formatNumber(Math.round(score ?? 0))}/100`;
}

export function formatDateTime(value: Date | string | null | undefined): string {
  if (value === null || value === undefined) {
    return "Not available";
  }

  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDuration(startedAt: Date | string, completedAt: Date | string): string {
  const start = typeof startedAt === "string" ? new Date(startedAt) : startedAt;
  const end = typeof completedAt === "string" ? new Date(completedAt) : completedAt;
  const durationMs = Math.max(0, end.getTime() - start.getTime());

  if (durationMs < 1000) {
    return `${durationMs} ms`;
  }

  return `${(durationMs / 1000).toFixed(1)} s`;
}

export function titleCaseIdentifier(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatCategory(category: TestCategory | string): string {
  return titleCaseIdentifier(category);
}

export function formatStatus(status: FindingStatus | string): string {
  if (status === "needs_review") {
    return "Needs review";
  }

  return titleCaseIdentifier(status);
}

export function formatSeverity(severity: Severity | string): string {
  return titleCaseIdentifier(severity);
}

export function truncateMiddle(value: string, maxLength = 48): string {
  if (value.length <= maxLength) {
    return value;
  }

  const sideLength = Math.floor((maxLength - 3) / 2);
  return `${value.slice(0, sideLength)}...${value.slice(value.length - sideLength)}`;
}
