# Deployment

AgentGuard supports two practical modes: CLI-only and local dashboard.

## CLI-Only Use

CLI-only mode is the safest default for quick local evaluation.

```bash
pnpm install
pnpm --filter @agentguard/cli build
pnpm --filter @agentguard/cli exec agentguard init --force
pnpm --filter @agentguard/cli exec agentguard run
```

No database is required.

## Local Web Dashboard

```bash
cp .env.example .env
pnpm db:up
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm --filter @agentguard/web dev
```

## Database Environment Variables

`.env.example` includes:

```txt
POSTGRES_USER=agentguard
POSTGRES_PASSWORD=agentguard
POSTGRES_DB=agentguard
POSTGRES_PORT=5432
DATABASE_URL=postgresql://agentguard:agentguard@localhost:5432/agentguard?schema=public
```

Use deployment-specific secrets for real environments. Do not commit `.env`.

## Deployment Considerations

- Add real authentication before exposing the dashboard beyond local/demo use.
- Keep demo data synthetic.
- Use managed PostgreSQL for hosted deployments.
- Disable or restrict external target adapters unless the deployment is explicitly authorized for those targets.
- Keep API error responses sanitized.
- Add rate limits and audit controls for shared environments.

## External Providers

Do not enable external provider calls by default. The OpenAI-compatible adapter is an interface for explicitly configured owned targets and should be used only with permission and clear environment separation.
