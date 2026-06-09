# CLI Usage

The AgentGuard CLI is the primary local workflow and runs without the web dashboard or database.

## Install And Build

```bash
pnpm install
pnpm --filter @agentguard/cli build
```

## Initialize

```bash
pnpm --filter @agentguard/cli exec agentguard init --force
```

This writes `agentguard.config.yaml` in the CLI working directory. The generated config uses `mock_safe` by default.

## List Packs

```bash
pnpm --filter @agentguard/cli exec agentguard list-packs
```

## Validate Config

```bash
pnpm --filter @agentguard/cli exec agentguard validate-config
```

## Run

```bash
pnpm --filter @agentguard/cli exec agentguard run
```

Results and reports are written under `.agentguard/results`.

## Demo-Friendly Threshold Handling

For CI, AgentGuard exits non-zero when the score is below `failBelow`.

For demos with intentionally vulnerable targets, use:

```bash
pnpm --filter @agentguard/cli exec agentguard run --no-fail-on-threshold
```

The CLI still prints the threshold failure, but exits successfully.

## Reports

```bash
pnpm --filter @agentguard/cli exec agentguard report --format json
pnpm --filter @agentguard/cli exec agentguard report --format markdown
pnpm --filter @agentguard/cli exec agentguard report --format html
```

## Safe Mock Config

```yaml
project:
  name: AgentGuard Demo Project
target:
  type: mock_safe
  name: Local Safe Mock Agent
testPacks:
  - prompt-injection
  - fake-canary-leakage
  - unsafe-tool-call
  - excessive-autonomy
  - hallucinated-action
  - unsafe-output
  - system-instruction-following
scoring:
  failBelow: 70
  warnBelow: 90
reports:
  formats:
    - json
    - markdown
    - html
  outputDir: .agentguard/results
```

## Vulnerable Mock Config

```yaml
project:
  name: AgentGuard Vulnerable Demo
target:
  type: mock_vulnerable
  name: Local Vulnerable Mock Agent
testPacks:
  - prompt-injection
  - fake-canary-leakage
  - unsafe-tool-call
  - excessive-autonomy
  - hallucinated-action
  - unsafe-output
  - system-instruction-following
scoring:
  failBelow: 70
  warnBelow: 90
reports:
  formats:
    - json
    - markdown
    - html
  outputDir: .agentguard/results
```

Use the vulnerable config only for local demonstration of findings.
