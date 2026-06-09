import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import type { EvaluationRun } from "@agentguard/core";
import { getEvaluationRunWithDetails, listProjectRuns, saveEvaluationRun } from "../src/index.js";

function integrationRun(): EvaluationRun {
  return {
    id: `test-db-run-${Date.now()}`,
    targetName: "DB Test Target",
    startedAt: new Date("2026-06-06T11:00:00.000Z").toISOString(),
    completedAt: new Date("2026-06-06T11:00:01.000Z").toISOString(),
    summary: {
      total: 2,
      passed: 1,
      failed: 1,
      needsReview: 0,
      score: 50,
      critical: 1,
      high: 0,
      medium: 1,
      low: 0,
    },
    results: [
      {
        testCaseId: "db-case-pass",
        status: "passed",
        score: 100,
        severity: "medium",
        category: "system_instruction_following",
        prompt: "Local DB safe prompt",
        response: "I cannot comply.",
        expectedBehaviour: "Refuse safely.",
        observedBehaviour: "Refused safely.",
        evidence: { ok: true },
        reason: "All checks passed.",
        remediation: "Keep policy boundaries explicit.",
      },
      {
        testCaseId: "db-case-open",
        status: "open",
        score: 0,
        severity: "critical",
        category: "fake_secret_leakage",
        prompt: "Local DB fake canary prompt",
        response: "Synthetic canary echoed.",
        expectedBehaviour: "Do not echo canary.",
        observedBehaviour: "Echoed canary.",
        evidence: { leaked: true },
        reason: "Synthetic canary leakage detected.",
        remediation: "Redact synthetic canary values.",
      },
    ],
  };
}

const hasDatabaseUrl =
  process.env.DATABASE_URL !== undefined && process.env.DATABASE_URL.length > 0;

if (!hasDatabaseUrl) {
  describe("db persistence integration", () => {
    it.skip("skips DB integration tests because DATABASE_URL is not set", () => {});
  });
} else {
  describe("db persistence integration", () => {
    const db = new PrismaClient();
    const userId = `test-user-${Date.now()}`;
    const projectId = `test-project-${Date.now()}`;
    const targetId = `test-target-${Date.now()}`;
    let runId: string;

    beforeAll(async () => {
      await db.user.create({
        data: {
          id: userId,
          email: `${userId}@agentguard.local`,
          name: "AgentGuard Persistence Test User",
        },
      });
      await db.project.create({
        data: {
          id: projectId,
          ownerId: userId,
          name: "AgentGuard Persistence Test Project",
        },
      });
      await db.target.create({
        data: {
          id: targetId,
          projectId,
          name: "AgentGuard Persistence Test Target",
          type: "mock_safe",
          configJson: { synthetic: true },
        },
      });
    });

    afterAll(async () => {
      if (runId !== undefined) {
        await db.auditLog.deleteMany({ where: { projectId } });
        await db.finding.deleteMany({ where: { runId } });
        await db.report.deleteMany({ where: { runId } });
        await db.evaluationResult.deleteMany({ where: { runId } });
        await db.evaluationRun.deleteMany({ where: { id: runId } });
      }
      await db.target.deleteMany({ where: { id: targetId } });
      await db.project.deleteMany({ where: { id: projectId } });
      await db.user.deleteMany({ where: { id: userId } });
      await db.$disconnect();
    });

    it("saves a mock evaluation run with results, findings, reports, and audit log", async () => {
      const run = integrationRun();
      runId = run.id;

      const saved = await saveEvaluationRun({
        prisma: db,
        run,
        projectId,
        targetId,
        config: { source: "persistence.test" },
        actorId: userId,
      });

      expect(saved).toEqual({
        runId,
        resultCount: 2,
        findingCount: 1,
        reportCount: 3,
      });

      const details = await getEvaluationRunWithDetails(runId, db);
      expect(details?.results).toHaveLength(2);
      expect(details?.findings).toHaveLength(1);
      expect(details?.reports).toHaveLength(3);

      const projectRuns = await listProjectRuns(projectId, db);
      expect(projectRuns.map((projectRun) => projectRun.id)).toContain(runId);
    });
  });
}
