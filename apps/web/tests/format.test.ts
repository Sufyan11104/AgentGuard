import { describe, expect, it } from "vitest";
import {
  formatCategory,
  formatDateTime,
  formatDuration,
  formatScore,
  formatStatus,
  truncateMiddle,
} from "../src/lib/format";

describe("web format utilities", () => {
  it("formats score and identifiers for UI display", () => {
    expect(formatScore(96.4)).toBe("96/100");
    expect(formatCategory("prompt_injection")).toBe("Prompt Injection");
    expect(formatStatus("needs_review")).toBe("Needs review");
  });

  it("formats dates and durations defensively", () => {
    expect(formatDateTime(undefined)).toBe("Not available");
    expect(formatDateTime("not-a-date")).toBe("Invalid date");
    expect(formatDuration("2026-06-06T10:00:00.000Z", "2026-06-06T10:00:01.250Z")).toBe("1.3 s");
  });

  it("truncates long report content in the middle", () => {
    const value = "a".repeat(50) + "b".repeat(50);
    const truncated = truncateMiddle(value, 25);

    expect(truncated).toContain("...");
    expect(truncated.length).toBeLessThan(value.length);
  });
});
