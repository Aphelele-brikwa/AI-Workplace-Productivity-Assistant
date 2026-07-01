import { Info } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="mt-10 flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p>
        AI-generated content may contain inaccuracies. Always review important emails, research,
        schedules, and meeting summaries before using them professionally.
      </p>
    </div>
  );
}
