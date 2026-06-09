import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-errors";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const runs = await prisma.evaluationRun.findMany({
      orderBy: {
        startedAt: "desc",
      },
      take: 25,
      include: {
        project: true,
        target: true,
        findings: true,
      },
    });

    return NextResponse.json({ runs });
  } catch {
    return NextResponse.json(databaseUnavailableResponse("Evaluation runs"), { status: 503 });
  }
}
