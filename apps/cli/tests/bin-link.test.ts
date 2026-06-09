import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(cliRoot, "../..");

describe("CLI bin metadata", () => {
  it("points agentguard to the built executable entry", async () => {
    const packageJsonPath = path.join(cliRoot, "package.json");
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
      bin?: Record<string, string>;
      type?: string;
    };

    expect(packageJson.type).toBe("module");
    expect(packageJson.bin?.agentguard).toBe("./dist/index.js");

    const binPath = path.join(cliRoot, packageJson.bin?.agentguard ?? "");
    await expect(access(binPath)).resolves.toBeUndefined();

    const builtEntry = await readFile(binPath, "utf8");
    expect(builtEntry.startsWith("#!/usr/bin/env node")).toBe(true);
  });

  it("executes through the workspace-linked pnpm bin wrapper", async () => {
    const workspaceBin = path.join(repoRoot, "node_modules", ".bin", "agentguard");

    await expect(access(workspaceBin)).resolves.toBeUndefined();

    const { stdout } = await execFileAsync(workspaceBin, ["--version"], {
      cwd: cliRoot,
    });

    expect(stdout.trim()).toBe("0.1.0");
  });
});
