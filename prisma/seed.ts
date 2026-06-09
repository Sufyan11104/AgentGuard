import { PrismaClient } from "@prisma/client";
import { createMockSafeAgent, createMockVulnerableAgent } from "@agentguard/adapters";
import { runEvaluation, type EvaluationRun } from "@agentguard/core";
import { saveEvaluationRun } from "@agentguard/db";
import { ALL_TEST_PACKS } from "@agentguard/test-packs";

const prisma = new PrismaClient();

function withDemoRunId(run: EvaluationRun, id: string): EvaluationRun {
  return {
    ...run,
    id,
  };
}

async function createDemoRun(agent: ReturnType<typeof createMockSafeAgent>, id: string) {
  const run = await runEvaluation({
    targetName: agent.name,
    testPacks: ALL_TEST_PACKS,
    invokeTarget: agent.invoke,
  });

  return withDemoRunId(run, id);
}

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@agentguard.local" },
    update: {
      name: "AgentGuard Demo User",
    },
    create: {
      id: "demo-user-local",
      email: "demo@agentguard.local",
      name: "AgentGuard Demo User",
    },
  });

  const project = await prisma.project.upsert({
    where: { id: "demo-project-local" },
    update: {
      name: "AgentGuard Demo Project",
      description: "Synthetic local demo project seeded by AgentGuard.",
      ownerId: user.id,
    },
    create: {
      id: "demo-project-local",
      name: "AgentGuard Demo Project",
      description: "Synthetic local demo project seeded by AgentGuard.",
      ownerId: user.id,
    },
  });

  const safeTarget = await prisma.target.upsert({
    where: { id: "demo-target-safe" },
    update: {
      projectId: project.id,
      name: "Local Safe Mock Agent",
      type: "mock_safe",
      configJson: { synthetic: true, dryRunOnly: true },
    },
    create: {
      id: "demo-target-safe",
      projectId: project.id,
      name: "Local Safe Mock Agent",
      type: "mock_safe",
      configJson: { synthetic: true, dryRunOnly: true },
    },
  });

  const vulnerableTarget = await prisma.target.upsert({
    where: { id: "demo-target-vulnerable" },
    update: {
      projectId: project.id,
      name: "Local Vulnerable Mock Agent",
      type: "mock_vulnerable",
      configJson: { synthetic: true, dryRunOnly: true, intentionallyVulnerable: true },
    },
    create: {
      id: "demo-target-vulnerable",
      projectId: project.id,
      name: "Local Vulnerable Mock Agent",
      type: "mock_vulnerable",
      configJson: { synthetic: true, dryRunOnly: true, intentionallyVulnerable: true },
    },
  });

  await prisma.auditLog.deleteMany({
    where: {
      projectId: project.id,
      entityId: { in: ["demo-safe-run", "demo-vulnerable-run"] },
    },
  });

  const safeRun = await createDemoRun(
    createMockSafeAgent("Local Safe Mock Agent"),
    "demo-safe-run",
  );
  const vulnerableRun = await createDemoRun(
    createMockVulnerableAgent("Local Vulnerable Mock Agent"),
    "demo-vulnerable-run",
  );

  await saveEvaluationRun({
    prisma,
    run: safeRun,
    projectId: project.id,
    targetId: safeTarget.id,
    config: { source: "seed", targetType: "mock_safe" },
    actorId: user.id,
  });

  await saveEvaluationRun({
    prisma,
    run: vulnerableRun,
    projectId: project.id,
    targetId: vulnerableTarget.id,
    config: { source: "seed", targetType: "mock_vulnerable" },
    actorId: user.id,
  });

  console.log("Seeded AgentGuard demo user, project, targets, and synthetic evaluation runs.");
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
