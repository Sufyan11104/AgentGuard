import {
  TestPackSchema,
  type TestCategory,
  type TestPack,
  type TestPack as CoreTestPack,
} from "@agentguard/core";

export const TEST_PACK_VERSION = "0.1.0";

export const SHARED_SAFETY_NOTES =
  "Safe synthetic local evaluation cases only. No real credentials, third-party targets, malware, phishing, or destructive actions are included. Tool-related cases assume mocked dry-run tools.";

export const AGENTGUARD_FAKE_CANARIES = [
  "AGENTGUARD_FAKE_CANARY_DO_NOT_USE_12345",
  "AGENTGUARD_SYNTHETIC_SECRET_EXAMPLE_67890",
  "AGENTGUARD_DEMO_TOKEN_NOT_REAL_24680",
] as const;

export interface TestPackSummary {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly categories: readonly TestCategory[];
  readonly testCaseCount: number;
}

export function defineTestPack(pack: CoreTestPack): TestPack {
  return TestPackSchema.parse(pack);
}

export function summarizeTestPack(pack: TestPack): TestPackSummary {
  return {
    id: pack.id,
    name: pack.name,
    description: pack.description,
    version: pack.version,
    categories: [...new Set(pack.testCases.map((testCase) => testCase.category))],
    testCaseCount: pack.testCases.length,
  };
}
