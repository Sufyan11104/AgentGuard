import { execFile } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { stringify } from "yaml";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { initCommand } from "../src/commands/init.js";
import { reportCommand } from "../src/commands/report.js";
import { runCommand } from "../src/commands/run.js";
import { createDefaultConfig } from "../src/config/schema.js";

const execFileAsync = promisify(execFile);
const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const builtCliEntry = path.join(cliRoot, "dist", "index.js");
let tempDir: string;

interface CliExecutionResult {
  readonly code: number;
  readonly stdout: string;
  readonly stderr: string;
}

async function execCli(args: readonly string[], cwd: string): Promise<CliExecutionResult> {
  try {
    const { stdout, stderr } = await execFileAsync(process.execPath, [builtCliEntry, ...args], {
      cwd,
    });
    return {
      code: 0,
      stdout,
      stderr,
    };
  } catch (error) {
    const execError = error as { code?: number; stdout?: string; stderr?: string };
    return {
      code: execError.code ?? 1,
      stdout: execError.stdout ?? "",
      stderr: execError.stderr ?? "",
    };
  }
}

async function writeVulnerableConfig(cwd: string): Promise<void> {
  const config = {
    ...createDefaultConfig(),
    target: {
      type: "mock_vulnerable",
      name: "Local Vulnerable Mock Agent",
    },
    reports: {
      formats: ["json"],
      outputDir: ".agentguard/results",
    },
  };

  await writeFile(path.join(cwd, "agentguard.config.yaml"), stringify(config), "utf8");
}

describe("CLI run and report commands", () => {
  beforeAll(async () => {
    try {
      await access(builtCliEntry);
    } catch {
      throw new Error(
        `Built CLI entry not found at ${builtCliEntry}. Run pnpm --filter @agentguard/cli build before executing these tests.`,
      );
    }
  });

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "agentguard-cli-run-"));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("runs the default safe mock config and writes evaluation artifacts", async () => {
    await initCommand({ cwd: tempDir });

    const result = await runCommand({ cwd: tempDir });
    const evaluationJson = JSON.parse(await readFile(result.artifacts.evaluationPath, "utf8")) as {
      summary: { total: number; score: number };
    };

    expect(result.thresholdPassed).toBe(true);
    expect(result.run.summary.total).toBe(22);
    expect(evaluationJson.summary.total).toBe(22);
    expect(evaluationJson.summary.score).toBeGreaterThanOrEqual(70);
    expect(result.artifacts.reports.map((report) => path.basename(report.path))).toEqual([
      "report.json",
      "report.md",
      "report.html",
    ]);
  });

  it("generates reports from the latest evaluation file", async () => {
    await initCommand({ cwd: tempDir });
    await runCommand({ cwd: tempDir });

    const reportDir = path.join(tempDir, "custom-reports");
    const result = await reportCommand({
      cwd: tempDir,
      outputDir: reportDir,
      formats: ["markdown"],
    });
    const markdownPath = result.reports[0]?.path;

    expect(markdownPath).toBe(path.join(reportDir, "report.md"));
    expect(await readFile(markdownPath ?? "", "utf8")).toContain("# AgentGuard Evaluation Report");
  });

  it("can run a vulnerable local mock target and fail the configured threshold", async () => {
    await mkdir(path.join(tempDir, "config"), { recursive: true });
    const configPath = path.join(tempDir, "config", "agentguard.config.yaml");
    const config = {
      ...createDefaultConfig(),
      target: {
        type: "mock_vulnerable",
        name: "Local Vulnerable Mock Agent",
      },
      reports: {
        formats: ["json"],
        outputDir: "../results",
      },
    };
    await writeFile(configPath, stringify(config), "utf8");

    const result = await runCommand({ cwd: tempDir, configPath });

    expect(result.thresholdPassed).toBe(false);
    expect(result.run.summary.failed).toBeGreaterThan(0);
    expect(result.artifacts.reports).toHaveLength(1);
    expect(result.artifacts.runDir).toContain(path.join(tempDir, "results"));
  });

  it("exits non-zero for vulnerable mock targets below the threshold by default", async () => {
    await writeVulnerableConfig(tempDir);

    const result = await execCli(["run"], tempDir);

    expect(result.code).toBe(1);
    expect(result.stdout).toContain("Score: 3/100");
    expect(result.stderr).toContain("Score 3 is below failBelow threshold 70.");
    expect(result.stderr).not.toContain("--no-fail-on-threshold");
  });

  it("exits zero for vulnerable mock targets when threshold failure is ignored", async () => {
    await writeVulnerableConfig(tempDir);

    const result = await execCli(["run", "--no-fail-on-threshold"], tempDir);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain("Score: 3/100");
    expect(result.stderr).toContain("Score 3 is below failBelow threshold 70.");
    expect(result.stderr).toContain(
      "Threshold failure ignored because --no-fail-on-threshold was used.",
    );
  });
});
