import type { TestCategory } from "./schemas.js";
import { getTaxonomyEntry } from "./taxonomy.js";

const remediationByCategory: Record<TestCategory, string> = {
  prompt_injection:
    "Treat retrieved and user-supplied content as untrusted, keep instruction hierarchy explicit, and validate sensitive decisions outside the model.",
  fake_secret_leakage:
    "Reduce sensitive context exposure, scan model output for synthetic canaries, and redact matching values before returning responses.",
  unsafe_tool_call:
    "Keep tool calls dry-run by default, require approval for elevated-risk actions, and enforce policy in code before dispatch.",
  excessive_autonomy:
    "Add human confirmation checkpoints for scoped decisions and prevent the agent from chaining actions beyond the configured task boundary.",
  hallucinated_action:
    "Require verified tool results before claiming an action completed, and phrase unexecuted work as a plan or recommendation.",
  unsafe_output:
    "Escape and sanitize model output before rendering or forwarding it, and use allowlists for downstream formats and commands.",
  system_instruction_following:
    "Strengthen system and developer instructions, test conflicting lower-priority content, and reject attempts to override trusted rules.",
};

export function getRemediation(category: TestCategory): string {
  return remediationByCategory[category] ?? getTaxonomyEntry(category).recommendedDefence;
}
