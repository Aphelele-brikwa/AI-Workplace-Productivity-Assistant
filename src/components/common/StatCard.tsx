import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tint = "primary",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  tint?: "primary" | "secondary" | "accent";
}) {
  const tintClass =
    tint === "accent"
      ? "from-accent/25 to-accent/5 text-accent"
      : tint === "secondary"
      ? "from-secondary/25 to-secondary/5 text-secondary"
      : "from-primary/25 to-primary/5 text-primary";

  return (
    <Card className="glass-card group relative overflow-hidden p-5 transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${tintClass} opacity-70 blur-2xl transition-opacity group-hover:opacity-100`}
      />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
          {delta && (
            <div className="mt-1 text-xs font-medium text-primary">{delta}</div>
          )}
        </div>
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${tintClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
