import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AiDisclaimer } from "./AiDisclaimer";
import { PageHeader } from "./PageHeader";

export function ComingSoon({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description: string;
  eyebrow: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <Card className="glass-card mt-8 overflow-hidden">
        <div className="gradient-mesh relative p-10 text-center sm:p-16">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl gradient-primary shadow-glow">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">Landing in the next iteration</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            This module is on the roadmap and will use the same structured inputs, editable
            outputs, and one-click actions as the other tools in Nimbus AI.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button asChild className="gradient-primary text-primary-foreground shadow-glow">
              <Link to="/chat">Ask the AI Chatbot</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/email">Try Smart Email</Link>
            </Button>
          </div>
        </div>
      </Card>

      <AiDisclaimer />
    </div>
  );
}
