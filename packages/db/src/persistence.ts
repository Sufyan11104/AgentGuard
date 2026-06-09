import { Prisma, type PrismaClient } from "@prisma/client";
import type { EvaluationRun } from "@agentguard/core";
import { prisma as defaultPrisma } from "./client.js";
import {
  mapEvaluationResultToDbInput,
  mapEvaluationRunToDbInput,
  mapFindingsFromResults,
  mapReportsFromRun,
} from "./mappers.js";

export interface SaveEvaluationRunParams {
  readonly prisma?: PrismaClient;
  readonly run: EvaluationRun;
  readonly projectId: string;
  readonly targetId: string;
  readonly config?: unknown;
  readonly actorId?: string;
}

export interface SaveEvaluationRunResult {
  readonly runId: string;
  readonly resultCount: number;
  readonly findingCount: number;
  readonly reportCount: number;
}

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function saveEvaluationRun(
  params: SaveEvaluationRunParams,
): Promise<SaveEvaluationRunResult> {
  const db = params.prisma ?? defaultPrisma;
  const runInput = mapEvaluationRunToDbInput(
    params.run,
    params.projectId,
    params.targetId,
    params.config,
  );
  const resultInputs = params.run.results.map((result) =>
    mapEvaluationResultToDbInput(result, params.run.id),
  );
  const findingInputs = mapFindingsFromResults(params.run);
  const reportInputs = mapReportsFromRun(params.run);

  return db.$transaction(async (tx) => {
    await tx.finding.deleteMany({ where: { runId: params.run.id } });
    await tx.report.deleteMany({ where: { runId: params.run.id } });
    await tx.evaluationResult.deleteMany({ where: { runId: params.run.id } });

    const updateRunInput: Prisma.EvaluationRunUncheckedUpdateInput = {
      projectId: runInput.projectId,
      targetId: runInput.targetId,
      status: runInput.status,
      score: runInput.score,
      startedAt: runInput.startedAt,
      completedAt: runInput.completedAt,
      summaryJson: runInput.summaryJson,
      configJson: runInput.configJson ?? Prisma.JsonNull,
    };

    await tx.evaluationRun.upsert({
      where: { id: params.run.id },
      create: runInput,
      update: updateRunInput,
    });

    if (resultInputs.length > 0) {
      await tx.evaluationResult.createMany({ data: resultInputs });
    }

    if (findingInputs.length > 0) {
      await tx.finding.createMany({ data: findingInputs });
    }

    if (reportInputs.length > 0) {
      await tx.report.createMany({ data: reportInputs });
    }

    await tx.auditLog.create({
      data: {
        projectId: params.projectId,
        actorId: params.actorId ?? null,
        action: "evaluation_run.saved",
        entityType: "EvaluationRun",
        entityId: params.run.id,
        metadataJson: toInputJson({
          runId: params.run.id,
          targetId: params.targetId,
          resultCount: resultInputs.length,
          findingCount: findingInputs.length,
          reportCount: reportInputs.length,
        }),
      },
    });

    return {
      runId: params.run.id,
      resultCount: resultInputs.length,
      findingCount: findingInputs.length,
      reportCount: reportInputs.length,
    };
  });
}

export async function getEvaluationRunWithDetails(runId: string, db = defaultPrisma) {
  return db.evaluationRun.findUnique({
    where: { id: runId },
    include: {
      project: true,
      target: true,
      results: true,
      findings: true,
      reports: true,
    },
  });
}

export async function listProjectRuns(projectId: string, db = defaultPrisma) {
  return db.evaluationRun.findMany({
    where: { projectId },
    orderBy: { startedAt: "desc" },
    include: {
      target: true,
      findings: true,
    },
  });
}
