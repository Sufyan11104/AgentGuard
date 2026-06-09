import {
  createMockSafeAgent,
  createMockVulnerableAgent,
  type TargetAdapter,
} from "@agentguard/adapters";
import { runEvaluation } from "@agentguard/core";
import { saveEvaluationRun } from "@agentguard/db";
import { ALL_TEST_PACKS } from "@agentguard/test-packs";
import { z } from "zod";
import { prisma } from "./db";

export const DemoTargetTypeSchema = z.enum(["mock_safe", "mock_vulnerable"]);
export type DemoTargetType = z.infer<typeof DemoTargetTypeSchema>;

export function getDemoTargetName(targetType: DemoTargetType): string {
  return targetType === "mock_safe" ? "Local Safe Mock Agent" : "Local Vulnerable Mock Agent";
}

export function getDemoTargetDescription(targetType: DemoTargetType): string {
  return targetType === "mock_safe"
    ? "A defensive mock agent expected to pass all synthetic checks."
    : "An intentionally vulnerable mock agent for demonstrating findings.";
}

export function createDemoAdapter(targetType: DemoTargetType): TargetAdapter {
  const name = getDemoTargetName(targetType);
  return targetType === "mock_safe" ? createMockSafeAgent(name) : createMockVulnerableAgent(name);
}

export async function ensureDemoTarget(projectId: string, targetType: DemoTargetType) {
  const existing = await prisma.target.findFirst({
    where: {
      projectId,
      type: targetType,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (existing !== null) {
    return existing;
  }

  return prisma.target.create({
    data: {
      projectId,
      name: getDemoTargetName(targetType),
      type: targetType,
      configJson: {
        synthetic: true,
        dryRunOnly: true,
        intentionallyVulnerable: targetType === "mock_vulnerable",
      },
    },
  });
}

export async function runAndSaveDemoEvaluation(input: {
  readonly projectId: string;
  readonly targetType: DemoTargetType;
}) {
  const project = await prisma.project.findUnique({
    where: {
      id: input.projectId,
    },
  });

  if (project === null) {
    throw new Error("Project was not found. Seed demo data with pnpm db:seed.");
  }

  const target = await ensureDemoTarget(input.projectId, input.targetType);
  const adapter = createDemoAdapter(input.targetType);
  const run = await runEvaluation({
    targetName: adapter.name,
    testPacks: ALL_TEST_PACKS,
    invokeTarget: adapter.invoke,
  });

  await saveEvaluationRun({
    run,
    projectId: input.projectId,
    targetId: target.id,
    config: {
      source: "web-demo",
      targetType: input.targetType,
      testPackIds: ALL_TEST_PACKS.map((pack) => pack.id),
    },
  });

  return {
    run,
    target,
    summary: run.summary,
  };
}
