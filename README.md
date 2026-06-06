# AgentGuard

AgentGuard is an open-source defensive security and evaluation toolkit for testing AI agents and LLM applications against common failure modes such as prompt injection, unsafe dry-run tool calls, fake canary leakage, ignored system instructions, hallucinated actions, excessive autonomy, and unsafe output handling.

This repository is being built CLI-first. The first working version will run fully from the command line without the web dashboard. The web app will reuse the same core runner, test packs, adapters, scoring, and report generators.

## Status

Stage 1 foundation is in place:

- pnpm workspace
- Turborepo task pipeline
- strict TypeScript base config
- ESLint and Prettier
- GitHub Actions CI
- Docker Compose PostgreSQL for local development
- environment example
- README skeleton

## Safety Notice

AgentGuard is for defensive testing only. Use it only on AI applications, agents, workflows, and systems that you own or have explicit permission to test. Built-in tests will use synthetic demo payloads, fake canary secrets, mocked targets, and dry-run tool calls by default.

Do not use this project for credential theft, malware, phishing, bypassing live systems, or attacking third-party services.

## Architecture

The planned monorepo structure is:

```txt
apps/
  cli/        CLI-first local evaluation tool
  web/        Next.js dashboard added after CLI is working
packages/
  core/       runner, schemas, scoring, reports, safety checks
  adapters/   mock, HTTP, OpenAI-compatible, dry-run tool adapters
  test-packs/ safe synthetic defensive evaluation cases
prisma/       PostgreSQL schema and seed data, added after CLI works
docs/         architecture, usage, threat model, safety policy
```

## Build Order

1. Monorepo foundation
2. Core runner, scoring, canary detector, tool policy checker, reports
3. Safe synthetic test packs
4. Target adapters
5. CLI
6. Prisma and PostgreSQL persistence
7. Web dashboard
8. Polish, docs, demo script, release checklist

## Local Setup

Requirements:

- Node.js 20.11 or newer
- pnpm 10 or newer
- Docker Desktop or compatible Docker runtime

Install dependencies:

```bash
pnpm install
```

Start PostgreSQL:

```bash
cp .env.example .env
pnpm db:up
```

Verify the foundation:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

## Screenshots

Screenshots will be added once the CLI reports and web dashboard are implemented.

```txt
docs/screenshots/dashboard.png
docs/screenshots/evaluation-results.png
docs/screenshots/finding-detail.png
docs/screenshots/html-report.png
```

## Limitations

- Stage 1 does not include the core runner, CLI, database schema, or web dashboard yet.
- PostgreSQL is the default local database. SQLite may be considered later as a lightweight mode only if JSON-heavy fields are stored as strings and are not deeply queried.
- Real authentication is intentionally out of scope for v1. The planned web demo will use seeded local demo data.

## License

MIT
