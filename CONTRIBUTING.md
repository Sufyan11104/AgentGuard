# Contributing

Thanks for considering a contribution to AgentGuard.

AgentGuard is a defensive AI security and evaluation toolkit. Contributions must preserve that scope.

## Ground Rules

- Use synthetic examples only.
- Do not include real credentials, secrets, malware, phishing, or bypass instructions.
- Do not add destructive tool execution.
- Do not enable external provider calls by default.
- Keep CLI mode independent from the database and web app.
- Keep package boundaries clear:
  - Evaluation logic in `packages/core`.
  - Test definitions in `packages/test-packs`.
  - Target invocation in `packages/adapters`.
  - Persistence in `packages/db`.

## Local Setup

```bash
pnpm install
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## CLI Smoke Test

```bash
pnpm --filter @agentguard/cli exec agentguard init --force
pnpm --filter @agentguard/cli exec agentguard run --no-fail-on-threshold
```

## Dashboard Setup

```bash
cp .env.example .env
pnpm db:up
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm --filter @agentguard/web dev
```

## Pull Requests

Include:

- A concise summary.
- Tests or a clear reason tests are not needed.
- Safety notes for new test packs, adapters, or demo flows.
- Verification output.

## Writing Test Packs

Read [docs/writing-test-packs.md](docs/writing-test-packs.md). New packs must be safe, synthetic, deterministic, and defensive.
