import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-errors";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        owner: true,
        targets: true,
        evaluationRuns: {
          orderBy: {
            startedAt: "desc",
          },
          take: 5,
        },
      },
    });

    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json(databaseUnavailableResponse("Projects"), { status: 503 });
  }
}
