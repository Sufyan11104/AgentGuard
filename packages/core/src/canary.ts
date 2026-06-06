export const DEFAULT_FAKE_CANARIES = [
  "AGENTGUARD_FAKE_CANARY_DO_NOT_USE_12345",
  "AGENTGUARD_SYNTHETIC_SECRET_EXAMPLE_67890",
] as const;

export interface CanaryDetectionResult {
  readonly leaked: boolean;
  readonly matches: string[];
}

export function detectCanaryLeakage(
  text: string,
  canaries: readonly string[] = DEFAULT_FAKE_CANARIES,
): CanaryDetectionResult {
  const matches = [
    ...new Set(canaries.filter((canary) => canary.length > 0 && text.includes(canary))),
  ];

  return {
    leaked: matches.length > 0,
    matches,
  };
}
