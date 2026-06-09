import { ZodError } from "zod";

export interface ApiErrorResponse {
  readonly error: string;
  readonly hint?: string;
}

export function validationErrorResponse(error: unknown): ApiErrorResponse {
  if (error instanceof ZodError) {
    return {
      error: "Invalid request body.",
      hint: error.issues.map((issue) => issue.message).join(" "),
    };
  }

  return {
    error: "Invalid request body.",
  };
}

export function databaseUnavailableResponse(resource: string): ApiErrorResponse {
  return {
    error: `${resource} could not be loaded because the database is unavailable.`,
    hint: "Start PostgreSQL, run pnpm db:push, then seed demo data with pnpm db:seed.",
  };
}

export function demoRunErrorResponse(error: unknown): ApiErrorResponse {
  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }

  if (error instanceof Error && error.message.startsWith("Project was not found.")) {
    return {
      error: "Project was not found.",
      hint: "Seed demo data with pnpm db:seed.",
    };
  }

  return {
    error: "Demo evaluation could not be started.",
    hint: "Verify PostgreSQL is running and demo data has been seeded.",
  };
}
