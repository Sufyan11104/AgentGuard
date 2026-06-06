import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { parse } from "yaml";
import { initCommand } from "../src/commands/init.js";
import { listPacksCommand } from "../src/commands/list-packs.js";
import { validateConfigCommand } from "../src/commands/validate-config.js";
import { createDefaultConfig, validateAgentGuardConfig } from "../src/config/schema.js";

let tempDir: string;

describe("config validation", () => {
  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "agentguard-cli-config-"));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("creates a schema-valid default config", () => {
    const config = createDefaultConfig();

    expect(config.project.name).toBe("AgentGuard Demo Project");
    expect(config.target.type).toBe("mock_safe");
    expect(config.testPacks).toHaveLength(7);
    expect(config.reports.formats).toEqual(["json", "markdown", "html"]);
  });

  it("rejects unknown test pack ids", () => {
    expect(() =>
      validateAgentGuardConfig({
        ...createDefaultConfig(),
        testPacks: ["not-a-pack"],
      }),
    ).toThrow("Unknown test pack id");
  });

  it("initializes and validates agentguard.config.yaml", async () => {
    const result = await initCommand({ cwd: tempDir });
    const raw = await readFile(result.filePath, "utf8");
    const parsed = parse(raw) as unknown;
    const loaded = await validateConfigCommand({ cwd: tempDir });

    expect(validateAgentGuardConfig(parsed).target.type).toBe("mock_safe");
    expect(loaded.filePath).toBe(result.filePath);
    expect(loaded.config.testPacks).toHaveLength(7);
  });

  it("does not overwrite an existing config unless forced", async () => {
    await initCommand({ cwd: tempDir });

    await expect(initCommand({ cwd: tempDir })).rejects.toThrow("Use --force");
    await expect(initCommand({ cwd: tempDir, force: true })).resolves.toBeDefined();
  });

  it("lists all available packs", () => {
    const packs = listPacksCommand();

    expect(packs).toHaveLength(7);
    expect(packs.map((pack) => pack.id)).toContain("prompt-injection");
  });
});
