import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { stringify } from "yaml";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initCommand } from "../src/commands/init.js";
import { reportCommand } from "../src/commands/report.js";
import { runCommand } from "../src/commands/run.js";
import { createDefaultConfig } from "../src/config/schema.js";

let tempDir: string;

describe("CLI run and report commands", () => {
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
});
