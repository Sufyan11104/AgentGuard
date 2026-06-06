import { EvaluationRunSchema, type EvaluationRun } from "../schemas.js";

export function generateJsonReport(run: EvaluationRun): string {
  const parsedRun = EvaluationRunSchema.parse(run);
  return `${JSON.stringify(parsedRun, null, 2)}\n`;
}
