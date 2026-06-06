import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  generateHtmlReport,
  generateJsonReport,
  generateMarkdownReport,
  parseEvaluationRun,
  type EvaluationRun,
} from "@agentguard/core";
import type { AgentGuardConfig, ReportFormat } from "../config/schema.js";

export interface WrittenReportFile {
  readonly format: ReportFormat;
  readonly path: string;
}

export interface RunArtifactPaths {
  readonly runDir: string;
  readonly evaluationPath: string;
  readonly reports: readonly WrittenReportFile[];
}

function reportFilename(format: ReportFormat): string {
  switch (format) {
    case "json":
      return "report.json";
    case "markdown":
      return "report.md";
    case "html":
      return "report.html";
  }
}

export function generateReport(format: ReportFormat, run: EvaluationRun): string {
  switch (format) {
    case "json":
      return generateJsonReport(run);
    case "markdown":
      return generateMarkdownReport(run);
    case "html":
      return generateHtmlReport(run);
  }
}

export async function writeRunArtifacts(
  cwd: string,
  config: AgentGuardConfig,
  run: EvaluationRun,
): Promise<RunArtifactPaths> {
  const resultsRoot = path.resolve(cwd, config.reports.outputDir);
  const safeRunId = run.id.replaceAll(/[^a-zA-Z0-9_.-]/g, "_");
  const runDir = path.join(resultsRoot, safeRunId);

  await mkdir(runDir, { recursive: true });

  const evaluationPath = path.join(runDir, "evaluation.json");
  await writeFile(evaluationPath, generateJsonReport(run), "utf8");

  const reports = await writeReports(runDir, run, config.reports.formats);

  return {
    runDir,
    evaluationPath,
    reports,
  };
}

export async function writeReports(
  outputDir: string,
  run: EvaluationRun,
  formats: readonly ReportFormat[],
): Promise<WrittenReportFile[]> {
  await mkdir(outputDir, { recursive: true });

  const written: WrittenReportFile[] = [];
  for (const format of formats) {
    const filePath = path.join(outputDir, reportFilename(format));
    await writeFile(filePath, generateReport(format, run), "utf8");
    written.push({ format, path: filePath });
  }

  return written;
}

export async function readEvaluationRun(filePath: string): Promise<EvaluationRun> {
  const raw = await readFile(filePath, "utf8");
  return parseEvaluationRun(JSON.parse(raw) as unknown);
}

export async function findLatestEvaluationFile(resultsDir: string): Promise<string> {
  const entries = await readdir(resultsDir, { withFileTypes: true });
  const candidates = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const evaluationPath = path.join(resultsDir, entry.name, "evaluation.json");
        try {
          const stats = await stat(evaluationPath);
          return { evaluationPath, mtimeMs: stats.mtimeMs };
        } catch {
          return undefined;
        }
      }),
  );

  const latest = candidates
    .filter(
      (candidate): candidate is { evaluationPath: string; mtimeMs: number } =>
        candidate !== undefined,
    )
    .sort((left, right) => right.mtimeMs - left.mtimeMs)[0];

  if (latest === undefined) {
    throw new Error(`No evaluation results found in ${resultsDir}. Run "agentguard run" first.`);
  }

  return latest.evaluationPath;
}
