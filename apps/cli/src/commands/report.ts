import { access } from "node:fs/promises";
import path from "node:path";
import { loadConfig } from "../config/load-config.js";
import {
  DEFAULT_RESULTS_DIR,
  ReportFormatSchema,
  type AgentGuardConfig,
  type ReportFormat,
} from "../config/schema.js";
import {
  findLatestEvaluationFile,
  readEvaluationRun,
  writeReports,
  type WrittenReportFile,
} from "../output/files.js";

export interface ReportCommandOptions {
  readonly cwd: string;
  readonly configPath?: string | undefined;
  readonly runPath?: string | undefined;
  readonly outputDir?: string | undefined;
  readonly formats?: readonly string[] | undefined;
}

export interface ReportCommandResult {
  readonly evaluationPath: string;
  readonly outputDir: string;
  readonly reports: readonly WrittenReportFile[];
}

async function optionalConfig(
  cwd: string,
  configPath: string | undefined,
): Promise<AgentGuardConfig | undefined> {
  try {
    return (await loadConfig(cwd, configPath)).config;
  } catch {
    return undefined;
  }
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function parseFormats(formats: readonly string[] | undefined): ReportFormat[] | undefined {
  if (formats === undefined || formats.length === 0) {
    return undefined;
  }

  return formats.map((format) => ReportFormatSchema.parse(format));
}

export async function reportCommand(options: ReportCommandOptions): Promise<ReportCommandResult> {
  const config = await optionalConfig(options.cwd, options.configPath);
  const requestedFormats = parseFormats(options.formats);
  const formats = requestedFormats ?? config?.reports.formats ?? ["json", "markdown", "html"];
  const baseResultsDir = path.resolve(
    options.cwd,
    config?.reports.outputDir ?? DEFAULT_RESULTS_DIR,
  );

  const evaluationPath =
    options.runPath !== undefined
      ? path.resolve(options.cwd, options.runPath)
      : await findLatestEvaluationFile(baseResultsDir);

  if (!(await exists(evaluationPath))) {
    throw new Error(`Evaluation file not found: ${evaluationPath}`);
  }

  const run = await readEvaluationRun(evaluationPath);
  const outputDir =
    options.outputDir !== undefined
      ? path.resolve(options.cwd, options.outputDir)
      : path.dirname(evaluationPath);
  const reports = await writeReports(outputDir, run, formats);

  return {
    evaluationPath,
    outputDir,
    reports,
  };
}
