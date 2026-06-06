import { loadConfig } from "../config/load-config.js";
import type { AgentGuardConfig } from "../config/schema.js";

export interface ValidateConfigCommandOptions {
  readonly cwd: string;
  readonly configPath?: string | undefined;
}

export interface ValidateConfigCommandResult {
  readonly filePath: string;
  readonly config: AgentGuardConfig;
}

export async function validateConfigCommand(
  options: ValidateConfigCommandOptions,
): Promise<ValidateConfigCommandResult> {
  return loadConfig(options.cwd, options.configPath);
}
