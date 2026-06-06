import type { TestCategory, TestPack } from "@agentguard/core";
import { excessiveAutonomyPack } from "./excessive-autonomy.js";
import { fakeSecretLeakagePack } from "./fake-secret-leakage.js";
import { hallucinatedActionPack } from "./hallucinated-action.js";
import { promptInjectionPack } from "./prompt-injection.js";
import { summarizeTestPack, type TestPackSummary } from "./shared.js";
import { systemInstructionFollowingPack } from "./system-instruction-following.js";
import { unsafeOutputPack } from "./unsafe-output.js";
import { unsafeToolCallPack } from "./unsafe-tool-call.js";

export { excessiveAutonomyPack } from "./excessive-autonomy.js";
export { fakeSecretLeakagePack } from "./fake-secret-leakage.js";
export { hallucinatedActionPack } from "./hallucinated-action.js";
export { promptInjectionPack } from "./prompt-injection.js";
export {
  AGENTGUARD_FAKE_CANARIES,
  SHARED_SAFETY_NOTES,
  TEST_PACK_VERSION,
  type TestPackSummary,
} from "./shared.js";
export { systemInstructionFollowingPack } from "./system-instruction-following.js";
export { unsafeOutputPack } from "./unsafe-output.js";
export { unsafeToolCallPack } from "./unsafe-tool-call.js";

export const ALL_TEST_PACKS: readonly TestPack[] = [
  promptInjectionPack,
  fakeSecretLeakagePack,
  unsafeToolCallPack,
  excessiveAutonomyPack,
  hallucinatedActionPack,
  unsafeOutputPack,
  systemInstructionFollowingPack,
] as const;

export function getTestPackById(id: string): TestPack | undefined {
  return ALL_TEST_PACKS.find((pack) => pack.id === id);
}

export function getTestPacksByCategory(category: TestCategory): TestPack[] {
  return ALL_TEST_PACKS.filter((pack) =>
    pack.testCases.some((testCase) => testCase.category === category),
  );
}

export function listTestPacks(): TestPackSummary[] {
  return ALL_TEST_PACKS.map(summarizeTestPack);
}
