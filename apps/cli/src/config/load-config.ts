import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { DEFAULT_CONFIG_FILE, validateAgentGuardConfig, type AgentGuardConfig } from "./schema.js";

const CONFIG_CANDIDATES = [DEFAULT_CONFIG_FILE, "agentguard.config.yml"];

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function findConfigFile(
  cwd: string,
  explicitPath?: string | undefined,
): Promise<string> {
  if (explicitPath !== undefined) {
    const resolved = path.resolve(cwd, explicitPath);
    if (!(await exists(resolved))) {
      throw new Error(`Config file not found: ${resolved}`);
    }

    return resolved;
  }

  for (const candidate of CONFIG_CANDIDATES) {
    const resolved = path.resolve(cwd, candidate);
    if (await exists(resolved)) {
      return resolved;
    }
  }

  throw new Error(`No AgentGuard config found. Run "agentguard init" first.`);
}

export async function loadConfig(
  cwd: string,
  explicitPath?: string | undefined,
): Promise<{
  readonly config: AgentGuardConfig;
  readonly filePath: string;
}> {
  const filePath = await findConfigFile(cwd, explicitPath);
  const raw = await readFile(filePath, "utf8");
  const parsed = parse(raw) as unknown;

  return {
    config: validateAgentGuardConfig(parsed),
    filePath,
  };
}
