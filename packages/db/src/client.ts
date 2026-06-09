import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  agentguardPrisma?: PrismaClient;
};

export type AgentGuardPrismaClient = PrismaClient;

export const prisma: PrismaClient = globalForPrisma.agentguardPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.agentguardPrisma = prisma;
}
