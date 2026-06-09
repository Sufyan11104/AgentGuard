#!/usr/bin/env node
import process from "node:process";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { listPacksCommand } from "./commands/list-packs.js";
import { reportCommand } from "./commands/report.js";
import { runCommand } from "./commands/run.js";
import { validateConfigCommand } from "./commands/validate-config.js";
import { printRunSummary } from "./output/console.js";

export function createProgram(): Command {
  const program = new Command();

  program.name("agentguard").description("Defensive AI agent evaluation toolkit.").version("0.1.0");

  program
    .command("init")
    .description("Create an agentguard.config.yaml file with safe local defaults.")
    .option("-c, --config <path>", "Config file path.")
    .option("--force", "Overwrite an existing config file.")
    .action(async (options: { config?: string; force?: boolean }) => {
      const result = await initCommand({
        cwd: process.cwd(),
        configPath: options.config,
        force: options.force,
      });
      console.log(`Created ${result.filePath}`);
    });

  program
    .command("validate-config")
    .description("Validate an AgentGuard YAML config file.")
    .option("-c, --config <path>", "Config file path.")
    .action(async (options: { config?: string }) => {
      const result = await validateConfigCommand({
        cwd: process.cwd(),
        configPath: options.config,
      });
      console.log(`Config is valid: ${result.filePath}`);
    });

  program
    .command("list-packs")
    .description("List available safe synthetic test packs.")
    .action(() => {
      for (const pack of listPacksCommand()) {
        console.log(`${pack.id}\t${pack.testCaseCount} cases\t${pack.name}`);
      }
    });

  program
    .command("run")
    .description("Run selected test packs against the configured target.")
    .option("-c, --config <path>", "Config file path.")
    .option(
      "--no-fail-on-threshold",
      "Print threshold failures but exit with code 0. Useful for demos with intentionally vulnerable targets.",
    )
    .action(async (options: { config?: string; failOnThreshold?: boolean }) => {
      const result = await runCommand({
        cwd: process.cwd(),
        configPath: options.config,
      });
      printRunSummary(result.run, result.artifacts);

      if (!result.thresholdPassed) {
        console.error(
          `Score ${result.run.summary.score} is below failBelow threshold ${result.config.scoring.failBelow}.`,
        );
        if (options.failOnThreshold === false) {
          console.error("Threshold failure ignored because --no-fail-on-threshold was used.");
        } else {
          process.exitCode = 1;
        }
      }
    });

  program
    .command("report")
    .description("Generate reports from an evaluation result file.")
    .option("-c, --config <path>", "Config file path.")
    .option("--run <path>", "Path to an evaluation.json file. Defaults to the latest run.")
    .option("-o, --output-dir <path>", "Directory where reports should be written.")
    .option("-f, --format <format...>", "Report format(s): json markdown html.")
    .action(
      async (options: { config?: string; run?: string; outputDir?: string; format?: string[] }) => {
        const result = await reportCommand({
          cwd: process.cwd(),
          configPath: options.config,
          runPath: options.run,
          outputDir: options.outputDir,
          formats: options.format,
        });
        console.log(`Evaluation: ${result.evaluationPath}`);
        for (const report of result.reports) {
          console.log(`${report.format} report: ${report.path}`);
        }
      },
    );

  return program;
}

export async function main(argv = process.argv): Promise<void> {
  try {
    await createProgram().parseAsync(argv);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`AgentGuard error: ${message}`);
    process.exitCode = 1;
  }
}

function isDirectlyExecuted(): boolean {
  if (process.argv[1] === undefined) {
    return false;
  }

  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isDirectlyExecuted()) {
  await main();
}
