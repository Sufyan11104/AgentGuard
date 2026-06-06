import type { TestCategory } from "./schemas.js";

export interface TaxonomyEntry {
  readonly label: string;
  readonly description: string;
  readonly exampleRisk: string;
  readonly recommendedDefence: string;
}

export const VULNERABILITY_TAXONOMY: Record<TestCategory, TaxonomyEntry> = {
  prompt_injection: {
    label: "Prompt injection resistance",
    description:
      "Checks whether an agent follows trusted instructions when untrusted content attempts to redirect behavior.",
    exampleRisk:
      "The model treats untrusted user or retrieved content as higher priority than developer or system constraints.",
    recommendedDefence:
      "Separate trusted and untrusted context, restate tool and data boundaries, and verify sensitive actions outside the model.",
  },
  fake_secret_leakage: {
    label: "Fake canary leakage",
    description:
      "Checks whether synthetic canary values are exposed in responses when they should remain internal.",
    exampleRisk:
      "A model includes internal-looking demo secrets in output instead of redacting or refusing to disclose them.",
    recommendedDefence:
      "Use secret scanning, response filtering, least-privilege context loading, and canary tokens in test environments.",
  },
  unsafe_tool_call: {
    label: "Unsafe dry-run tool call",
    description:
      "Checks whether requested tool calls remain dry-run, approval-gated, and within declared risk policy.",
    exampleRisk:
      "An agent proposes or executes a high-risk action without an approval signal in the tool-call metadata.",
    recommendedDefence:
      "Require explicit approval for risky actions, enforce dry-run defaults, and validate tool calls before dispatch.",
  },
  excessive_autonomy: {
    label: "Excessive autonomy",
    description:
      "Checks whether an agent proceeds beyond its allowed scope instead of asking for confirmation.",
    exampleRisk:
      "The agent takes multi-step decisions or operational actions without human review where policy requires it.",
    recommendedDefence:
      "Define autonomy limits, add confirmation checkpoints, and log decisions for review before side effects occur.",
  },
  hallucinated_action: {
    label: "Hallucinated action",
    description:
      "Checks whether an agent claims to have completed an action that was not actually executed by a trusted system.",
    exampleRisk:
      "The assistant says a ticket, email, deployment, or payment was completed even though no backing tool confirmed it.",
    recommendedDefence:
      "Only report completed actions from verified tool results and clearly distinguish plans from completed work.",
  },
  unsafe_output: {
    label: "Unsafe output handling",
    description:
      "Checks whether the application emits content that should be escaped, redacted, or handled as untrusted output.",
    exampleRisk:
      "The model returns unsafe markup or operational instructions that downstream systems might render or execute directly.",
    recommendedDefence:
      "Escape rendered content, sanitize untrusted output, and apply allowlists before passing model output downstream.",
  },
  system_instruction_following: {
    label: "System instruction following",
    description:
      "Checks whether the agent preserves high-priority behavioral rules when lower-priority content conflicts.",
    exampleRisk:
      "The agent ignores system-level safety, privacy, or scope instructions after receiving conflicting user content.",
    recommendedDefence:
      "Make instruction hierarchy explicit, keep safety rules out of user-editable context, and test conflicting prompts.",
  },
};

export function getTaxonomyEntry(category: TestCategory): TaxonomyEntry {
  return VULNERABILITY_TAXONOMY[category];
}
