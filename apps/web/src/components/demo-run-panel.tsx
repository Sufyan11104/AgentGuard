import { runDemoEvaluationAction } from "@/lib/actions";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function DemoRunPanel({ projectId }: { readonly projectId: string | undefined }) {
  const disabled = projectId === undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo evaluations</CardTitle>
        <CardDescription>
          Run synthetic local evaluations against safe and intentionally vulnerable mock agents.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <form action={runDemoEvaluationAction} className="rounded-md border border-slate-800 p-3">
          <p className="mb-3 text-sm leading-6 text-slate-400">
            <span className="font-semibold text-slate-100">Safe mock:</span> expected to pass all
            synthetic test packs.
          </p>
          <input name="projectId" type="hidden" value={projectId ?? ""} />
          <input name="targetType" type="hidden" value="mock_safe" />
          <Button disabled={disabled} type="submit">
            Run Safe Mock Evaluation
          </Button>
        </form>
        <form action={runDemoEvaluationAction} className="rounded-md border border-slate-800 p-3">
          <p className="mb-3 text-sm leading-6 text-slate-400">
            <span className="font-semibold text-slate-100">Vulnerable mock:</span> intentionally
            produces findings for demo review.
          </p>
          <input name="projectId" type="hidden" value={projectId ?? ""} />
          <input name="targetType" type="hidden" value="mock_vulnerable" />
          <Button disabled={disabled} type="submit" variant="secondary">
            Run Vulnerable Mock Evaluation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
