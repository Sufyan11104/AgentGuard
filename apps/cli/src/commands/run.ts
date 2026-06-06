import path from "node:path";
import {
  createHttpAdapter,
  createMockSafeAgent,
  createMockVulnerableAgent,
  createOpenAICompatibleAdapter,
  type TargetAdapter,
} from "@agentguard/adapters";
import { runEvaluation, type EvaluationRun, type TestPack } from "@agentguard/core";
import { ALL_TEST_PACKS } from "@agentguard/test-packs";
import { loadConfig } from "../config/load-config.js";
import type { AgentGuardConfig, TargetConfig } from "../config/schema.js";
import { writeRunArtifacts, type RunArtifactPaths } from "../output/files.js";

export interface RunCommandOptions {
  readonly cwd: string;
  readonly configPath?: string | undefined;
}

export interface RunCommandResult {
  readonly config: AgentGuardConfig;
  readonly configPath: string;
  readonly run: EvaluationRun;
  readonly artifacts: RunArtifactPaths;
  readonly thresholdPassed: boolean;
}

export function createAdapterFromConfig(target: TargetConfig): TargetAdapter {
  switch (target.type) {
    case "mock_safe":
      return createMockSafeAgent(target.name);
    case "mock_vulnerable":
      return createMockVulnerableAgent(target.name);
    case "http":
      return createHttpAdapter({
        name: target.name,
        endpoint: target.endpoint,
        method: "POST",
        headers: target.headers,
        timeoutMs: target.timeoutMs,
      });
    case "openai_compatible":
      return createOpenAICompatibleAdapter({
        name: target.name,
        endpoint: target.endpoint,
        model: target.model,
        apiKeyEnvVar: target.apiKeyEnvVar,
        timeoutMs: target.timeoutMs,
        temperature: target.temperature,
      });
  }
}

export function resolveTestPacks(config: AgentGuardConfig): TestPack[] {
  return config.testPacks.map((packId) => {
    const pack = ALL_TEST_PACKS.find((candidate) => candidate.id === packId);
    if (pack === undefined) {
      throw new Error(`Unknown test pack id: ${packId}`);
    }

    return pack;
  });
}

export async function runCommand(options: RunCommandOptions): Promise<RunCommandResult> {
  const loaded = await loadConfig(options.cwd, options.configPath);
  const adapter = createAdapterFromConfig(loaded.config.target);
  const testPacks = resolveTestPacks(loaded.config);
  const run = await runEvaluation({
    targetName: adapter.name,
    testPacks,
    invokeTarget: adapter.invoke,
  });
  const artifacts = await writeRunArtifacts(path.dirname(loaded.filePath), loaded.config, run);

  return {
    config: loaded.config,
    configPath: loaded.filePath,
    run,
    artifacts,
    thresholdPassed: run.summary.score >= loaded.config.scoring.failBelow,
  };
}
