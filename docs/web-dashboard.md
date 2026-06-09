# Web Dashboard

The web dashboard is a Next.js App Router app in `apps/web`. It uses the existing AgentGuard packages and PostgreSQL persistence through `@agentguard/db`.

## Database Setup

```bash
cp .env.example .env
pnpm db:up
pnpm db:generate
pnpm db:push
pnpm db:seed
```

Then start the dashboard:

```bash
pnpm --filter @agentguard/web dev
```

Open `http://localhost:3000`.

## Seed Data

`pnpm db:seed` creates:

- Demo user.
- Demo project.
- Safe mock target.
- Vulnerable mock target.
- One synthetic safe evaluation run.
- One synthetic vulnerable evaluation run.
- Results, findings, reports, and audit logs.

## Pages

- `/`: landing page.
- `/dashboard`: metrics, recent runs, and demo run panel.
- `/projects`: projects list.
- `/projects/[projectId]`: targets, recent runs, and findings summary.
- `/projects/[projectId]/evaluations/new`: run a demo evaluation.
- `/evaluations/[runId]`: score, results, findings, evidence, and reports.
- `/findings/[findingId]`: finding detail and remediation.
- `/reports`: latest report previews.
- `/docs`: dashboard-local documentation page.

## Demo Run Flow

The dashboard can run:

- Safe mock evaluation: expected to pass all synthetic checks.
- Vulnerable mock evaluation: intentionally produces findings.

Both flows use:

- `ALL_TEST_PACKS` from `@agentguard/test-packs`.
- Mock adapters from `@agentguard/adapters`.
- `runEvaluation` from `@agentguard/core`.
- `saveEvaluationRun` from `@agentguard/db`.

## Fallback Behavior

If PostgreSQL is unavailable, pages render useful empty or unavailable states instead of crashing. API routes return sanitized setup guidance and do not expose raw Prisma stack traces.
