import { listTestPacks, type TestPackSummary } from "@agentguard/test-packs";

export function listPacksCommand(): TestPackSummary[] {
  return listTestPacks();
}
