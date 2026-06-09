import { prisma } from "@agentguard/db";

export { prisma };

export interface DbLoadResult<T> {
  readonly data: T;
  readonly dbReady: boolean;
  readonly error?: string;
}

export async function loadDbData<T>(
  loader: () => Promise<T>,
  fallback: T,
): Promise<DbLoadResult<T>> {
  try {
    return {
      data: await loader(),
      dbReady: true,
    };
  } catch {
    return {
      data: fallback,
      dbReady: false,
      error: "Database is not available. Start PostgreSQL and seed demo data with pnpm db:seed.",
    };
  }
}
