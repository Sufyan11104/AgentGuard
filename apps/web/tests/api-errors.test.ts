import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  databaseUnavailableResponse,
  demoRunErrorResponse,
  validationErrorResponse,
} from "../src/lib/api-errors";

describe("web API error responses", () => {
  it("returns sanitized database errors without raw exception details", () => {
    const response = databaseUnavailableResponse("Projects");

    expect(response.error).toBe(
      "Projects could not be loaded because the database is unavailable.",
    );
    expect(response.hint).toContain("pnpm db:seed");
    expect(JSON.stringify(response)).not.toContain("PrismaClientKnownRequestError");
  });

  it("returns useful validation error hints", () => {
    const schema = z.object({ projectId: z.string().min(1) });
    const result = schema.safeParse({ projectId: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(validationErrorResponse(result.error).error).toBe("Invalid request body.");
      expect(validationErrorResponse(result.error).hint).toContain("Too small");
    }
  });

  it("does not expose raw demo run failure messages", () => {
    const response = demoRunErrorResponse(
      new Error("Invalid `prisma.project.findMany()` invocation at /local/path"),
    );

    expect(response.error).toBe("Demo evaluation could not be started.");
    expect(JSON.stringify(response)).not.toContain("prisma.project.findMany");
  });
});
