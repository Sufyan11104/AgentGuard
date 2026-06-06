import { describe, expect, it } from "vitest";
import { TestCaseSchema, TestPackSchema, type TestCase, type TestPack } from "@agentguard/core";
import {
  AGENTGUARD_FAKE_CANARIES,
  ALL_TEST_PACKS,
  fakeSecretLeakagePack,
  getTestPackById,
  getTestPacksByCategory,
  listTestPacks,
} from "../src/index.js";

function allTestCases(): TestCase[] {
  return ALL_TEST_PACKS.flatMap((pack) => pack.testCases);
}

function searchableText(testCase: TestCase): string {
  return [
    testCase.id,
    testCase.title,
    testCase.input,
    testCase.expectedBehaviour,
    testCase.remediation,
    testCase.tags.join(" "),
    ...testCase.assertions.map((assertion) =>
      [assertion.type, assertion.value ?? "", assertion.description].join(" "),
    ),
  ].join(" ");
}

function findDuplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  }

  return [...duplicates];
}

describe("test packs", () => {
  it("exports exactly seven packs", () => {
    expect(ALL_TEST_PACKS).toHaveLength(7);
  });

  it("validates every pack with the core schema", () => {
    for (const pack of ALL_TEST_PACKS) {
      expect(TestPackSchema.parse(pack)).toBeDefined();
    }
  });

  it("validates every test case with the core schema", () => {
    for (const testCase of allTestCases()) {
      expect(TestCaseSchema.parse(testCase)).toBeDefined();
    }
  });

  it("uses unique pack IDs", () => {
    const ids = ALL_TEST_PACKS.map((pack) => pack.id);

    expect(findDuplicates(ids)).toEqual([]);
  });

  it("uses unique test case IDs across all packs", () => {
    const ids = allTestCases().map((testCase) => testCase.id);

    expect(findDuplicates(ids)).toEqual([]);
  });

  it("keeps all cases synthetic and avoids obvious real-secret phrasing", () => {
    const forbiddenPhrases = ["real password", "actual api key", "live credential"];

    for (const testCase of allTestCases()) {
      const text = searchableText(testCase).toLocaleLowerCase();

      for (const phrase of forbiddenPhrases) {
        expect(text).not.toContain(phrase);
      }
    }
  });

  it("uses only AgentGuard fake canaries in fake canary cases", () => {
    const allowed = new Set<string>(AGENTGUARD_FAKE_CANARIES);
    const tokenPattern = /\bAGENTGUARD_[A-Z0-9_]+\b/g;

    for (const testCase of fakeSecretLeakagePack.testCases) {
      const tokens = searchableText(testCase).match(tokenPattern) ?? [];
      expect(tokens.length).toBeGreaterThan(0);

      for (const token of tokens) {
        expect(allowed.has(token)).toBe(true);
      }
    }
  });

  it("includes at least one assertion and remediation for every test case", () => {
    for (const testCase of allTestCases()) {
      expect(testCase.assertions.length).toBeGreaterThan(0);
      expect(testCase.remediation.trim().length).toBeGreaterThan(0);
    }
  });

  it("supports pack lookup helpers", () => {
    const promptPack = getTestPackById("prompt-injection");
    const unsafeToolPacks = getTestPacksByCategory("unsafe_tool_call");
    const summaries = listTestPacks();

    expect(promptPack?.id).toBe("prompt-injection");
    expect(unsafeToolPacks.map((pack: TestPack) => pack.id)).toEqual(["unsafe-tool-call"]);
    expect(summaries).toHaveLength(7);
    expect(summaries[0]).toMatchObject({
      id: ALL_TEST_PACKS[0]?.id,
      testCaseCount: ALL_TEST_PACKS[0]?.testCases.length,
    });
  });
});
