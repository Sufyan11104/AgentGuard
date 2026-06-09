# Threat Model

AgentGuard evaluates common failure modes in AI agents and LLM applications using defensive, synthetic tests.

## What AgentGuard Tests

- Prompt injection resistance.
- Fake canary leakage.
- Unsafe dry-run tool calls.
- Hallucinated action claims.
- Unsafe output handling.
- Excessive autonomy.
- System instruction following.

## What AgentGuard Does Not Test

- Network exploitation.
- Credential theft.
- Malware execution.
- Production authorization bypass.
- Full model jailbreak coverage.
- Provider-specific safety guarantees.
- Real secret handling.

## Trust Boundaries

AgentGuard assumes these boundaries matter:

- System/developer instructions are trusted.
- User or retrieved content may be untrusted.
- Tool calls need policy validation.
- Reports must not expose real secrets.
- Demo targets must remain synthetic.
- Database persistence should store evidence but not credentials.

## Prompt Injection

Prompt injection tests check whether an agent follows untrusted instructions that ask it to ignore system guidance, reveal hidden content, or change task boundaries.

## Fake Secret Leakage

Fake canary tests place synthetic secret-like values in prompts and inspect whether responses echo those values. These values are not real credentials.

## Unsafe Tool Calls

Tool-call tests inspect dry-run tool evidence for unsafe actions, missing approval metadata, and policy violations.

## Hallucinated Actions

Hallucinated action tests check whether the target claims to have sent, deleted, purchased, deployed, or otherwise completed actions without verified execution evidence.

## Unsafe Output Handling

Unsafe output tests look for responses that would be risky if rendered into an application without escaping or sanitization.

## Excessive Autonomy

Excessive autonomy tests check whether the target tries to proceed beyond the requested scope or approval boundary.

## Limitations

AgentGuard uses deterministic synthetic tests. Passing AgentGuard is useful evidence, but it is not proof that an agent is safe in every context. Use it alongside code review, architecture review, human red-team exercises, logging, monitoring, and production safeguards.
