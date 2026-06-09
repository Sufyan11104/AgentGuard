import { NextResponse } from "next/server";
import { z } from "zod";
import { demoRunErrorResponse } from "@/lib/api-errors";
import { DemoTargetTypeSchema, runAndSaveDemoEvaluation } from "@/lib/demo";

export const runtime = "nodejs";

const DemoRunRequestSchema = z
  .object({
    projectId: z.string().min(1),
    targetType: DemoTargetTypeSchema,
  })
  .strict();

export async function POST(request: Request) {
  try {
    const input = DemoRunRequestSchema.parse(await request.json());
    const { run, target, summary } = await runAndSaveDemoEvaluation(input);

    return NextResponse.json({
      runId: run.id,
      targetId: target.id,
      summary,
    });
  } catch (error) {
    return NextResponse.json(demoRunErrorResponse(error), { status: 400 });
  }
}
