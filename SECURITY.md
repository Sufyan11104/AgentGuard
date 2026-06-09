# Security Policy

AgentGuard is a defensive evaluation toolkit. Please report security issues responsibly.

## Supported Versions

The current `main` branch is the active development version.

## Reporting A Vulnerability

Do not disclose exploitable vulnerabilities publicly before maintainers have had time to review them.

When reporting, include:

- A concise description.
- A minimal reproduction using synthetic data.
- Affected package or app.
- Impact and suggested remediation.

Do not include real credentials, customer data, malware, phishing content, or instructions for attacking third-party systems.

## Scope

In scope:

- Bugs that expose raw secrets or raw database errors.
- Unsafe default behavior.
- Destructive tool execution paths.
- Test-pack content that violates the safety policy.

Out of scope:

- Attacks against third-party services.
- Social engineering.
- Denial-of-service testing without permission.
- Reports using real stolen credentials or private data.

## Defensive Use

Use AgentGuard only on systems you own or have permission to evaluate. Built-in demos use synthetic payloads, fake canaries, mock targets, and dry-run tool calls.
