# Demo Script

## Two-Minute Recruiter Demo

1. "AgentGuard is a defensive evaluation toolkit for AI agents. It tests owned agents against prompt injection, fake canary leakage, unsafe tool calls, hallucinated actions, and unsafe output handling."
2. Run the safe mock:

   ```bash
   pnpm --filter @agentguard/cli exec agentguard init --force
   pnpm --filter @agentguard/cli exec agentguard run
   ```

3. Show the `100/100` score.
4. Switch the config target to `mock_vulnerable`.
5. Run:

   ```bash
   pnpm --filter @agentguard/cli exec agentguard run --no-fail-on-threshold
   ```

6. Show the low score, findings, and generated reports.
7. Open the dashboard and show project, run, finding, evidence, and report views.
8. Close with: "The web app reuses the same core runner, test packs, adapters, scoring, and reports as the CLI."

## Five-Minute Technical Demo

1. Show monorepo packages:
   - `packages/core`
   - `packages/test-packs`
   - `packages/adapters`
   - `packages/db`
   - `apps/cli`
   - `apps/web`
2. Run safe and vulnerable CLI demos.
3. Open JSON, Markdown, and HTML reports.
4. Start PostgreSQL and seed dashboard data:

   ```bash
   cp .env.example .env
   pnpm db:up
   pnpm db:push
   pnpm db:seed
   pnpm --filter @agentguard/web dev
   ```

5. Walk through:
   - `/dashboard`
   - `/projects`
   - `/evaluations/[runId]`
   - `/findings/[findingId]`
   - `/reports`
6. Explain API routes use sanitized errors and dashboard demo runs use mock adapters only.
7. Mention current limitations: no real auth, no hosted deployment, deterministic synthetic tests only.

## Architecture Talking Points

- `@agentguard/core` owns evaluation behavior.
- `@agentguard/test-packs` owns safe synthetic tests.
- `@agentguard/adapters` owns target invocation.
- `@agentguard/db` owns persistence.
- CLI and web are thin orchestration layers.

## Safety Talking Points

- Defensive use only.
- Owned or explicitly authorized systems only.
- Fake canaries only.
- Dry-run tool calls by default.
- No external AI calls by default.
- No destructive actions.
