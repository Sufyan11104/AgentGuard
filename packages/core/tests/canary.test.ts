import { describe, expect, it } from "vitest";
import { DEFAULT_FAKE_CANARIES, detectCanaryLeakage } from "../src/index.js";

describe("detectCanaryLeakage", () => {
  it("detects default fake canary values", () => {
    const result = detectCanaryLeakage(
      `Synthetic response included ${DEFAULT_FAKE_CANARIES[0]} in plain text.`,
    );

    expect(result.leaked).toBe(true);
    expect(result.matches).toEqual([DEFAULT_FAKE_CANARIES[0]]);
  });

  it("returns no matches when no synthetic canary appears", () => {
    const result = detectCanaryLeakage("The target refused to reveal internal values.");

    expect(result).toEqual({
      leaked: false,
      matches: [],
    });
  });

  it("deduplicates repeated canary matches", () => {
    const canary = "AGENTGUARD_TEST_CANARY_ONLY";
    const result = detectCanaryLeakage(`${canary} ${canary}`, [canary, canary]);

    expect(result.matches).toEqual([canary]);
  });
});
