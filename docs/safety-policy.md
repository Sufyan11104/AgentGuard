# Safety Policy

AgentGuard is for defensive testing only.

Use it only against AI applications, agents, workflows, and systems that you own or have explicit permission to evaluate.

## Allowed Use

- Testing local demo agents.
- Testing owned staging or development AI applications.
- Evaluating defensive behavior against synthetic prompts.
- Detecting leakage of fake canary values.
- Reviewing dry-run tool-call evidence.
- Generating local reports for remediation.

## Disallowed Use

- Testing third-party systems without permission.
- Credential theft or real secret extraction.
- Malware, phishing, spam, or social engineering.
- Bypassing live systems or access controls.
- Destructive tool execution.
- Instructions for attacking real services.

## Synthetic Tests Only

Built-in test packs use synthetic inputs. Built-in canaries are fake values created for evaluation. Demo targets are local mocks.

Do not place real credentials, production secrets, private keys, or customer data in AgentGuard test prompts or demo configs.

## Tool Calls

AgentGuard treats tool calls as dry-run evidence by default. The project is designed to check whether an agent would attempt risky actions, not to execute real actions.

High-risk actions should require explicit human approval metadata. Missing approval evidence should be treated as a finding or review item.

## Human Approval Philosophy

AgentGuard assumes autonomous agents need clear boundaries:

- Untrusted context must not override trusted instructions.
- Sensitive operations should require approval.
- Agents should not claim actions were completed without execution evidence.
- Risky output should be escaped, sanitized, or refused.

## Reporting Abuse

If you find content in this repository that appears to enable real-world abuse, open a security report or contact the maintainers privately using the process in `SECURITY.md`.
