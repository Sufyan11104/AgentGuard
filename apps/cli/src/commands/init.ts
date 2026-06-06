import { access, writeFile } from "node:fs/promises";
import path from "node:path";
import { stringify } from "yaml";
import {
  createDefaultConfig,
  DEFAULT_CONFIG_FILE,
  type AgentGuardConfig,
} from "../config/schema.js";

export interface InitCommandOptions {
  readonly cwd: string;
  readonly configPath?: string | undefined;
  readonly force?: boolean | undefined;
}

export interface InitCommandResult {
  readonly filePath: string;
  readonly config: AgentGuardConfig;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function initCommand(options: InitCommandOptions): Promise<InitCommandResult> {
  const filePath = path.resolve(options.cwd, options.configPath ?? DEFAULT_CONFIG_FILE);

  if ((await fileExists(filePath)) && options.force !== true) {
    throw new Error(`Config already exists at ${filePath}. Use --force to overwrite it.`);
  }

  const config = createDefaultConfig();
  await writeFile(filePath, stringify(config), "utf8");

  return {
    filePath,
    config,
  };
}
