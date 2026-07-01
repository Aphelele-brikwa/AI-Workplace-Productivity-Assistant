import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/PageHeader";
import { AiDisclaimer } from "@/components/common/AiDisclaimer";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { STORAGE_KEYS, removeKey } from "@/lib/storage";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Nimbus AI" },
      { name: "description", content: "Manage your Nimbus AI preferences, theme, and local history." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const clearAll = () => {
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k !== STORAGE_KEYS.theme) removeKey(k);
    });
    toast.success("Local history cleared");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Settings"
        title="Preferences"
        description="Everything runs locally in your browser — no account needed."
      />

      <Card className="glass-card mt-8 divide-y divide-border/60 p-0">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-6">
          <div className="min-w-0">
            <Label className="text-base">Appearance</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Toggle between light and dark themes. Your choice is remembered on this device.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-6">
          <div className="min-w-0">
            <Label className="text-base">Local history</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Removes saved emails, chat threads, activity, and stats from this browser.
            </p>
          </div>
          <Button variant="outline" onClick={clearAll} className="shrink-0">
            <Trash2 className="h-4 w-4" /> Clear
          </Button>
        </div>
      </Card>

      <AiDisclaimer />
    </div>
  );
}
