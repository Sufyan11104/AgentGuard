"use server";

import { redirect } from "next/navigation";
import { DemoTargetTypeSchema, runAndSaveDemoEvaluation } from "./demo";

export async function runDemoEvaluationAction(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const targetType = DemoTargetTypeSchema.parse(formData.get("targetType"));

  const { run } = await runAndSaveDemoEvaluation({
    projectId,
    targetType,
  });

  redirect(`/evaluations/${run.id}`);
}
