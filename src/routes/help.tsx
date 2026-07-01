import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Calendar, HelpCircle, Mail, Search, StickyNote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { AiDisclaimer } from "@/components/common/AiDisclaimer";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Nimbus AI" },
      { name: "description", content: "Learn how to get the most out of your Nimbus AI workspace." },
    ],
  }),
  component: HelpPage,
});

const items = [
  { icon: Mail, title: "Smart Email Generator", body: "Fill in recipient, subject, purpose, and key points. Pick a tone and length — Nimbus assembles a polished draft you can edit and download.", to: "/email" },
  { icon: Bot, title: "AI Chatbot", body: "Ask questions, request drafts, plan your day, or explore ideas. Every conversation is saved in your browser.", to: "/chat" },
  { icon: StickyNote, title: "Meeting Notes", body: "Coming next — paste raw notes and receive decisions, action items, deadlines, and risks.", to: "/notes" },
  { icon: Calendar, title: "Task Planner", body: "Coming next — enter tasks and get a balanced schedule for the day or week.", to: "/planner" },
  { icon: Search, title: "Research Assistant", body: "Coming next — summarize any topic with key findings, pros, cons, and recommendations.", to: "/research" },
];

function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Help" title="How Nimbus works" description="A quick tour of each tool in your workspace." />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="group block"
          >
            <Card className="glass-card h-full p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-elegant">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
                  <it.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-semibold">{it.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{it.body}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        <Card className="glass-card p-5 sm:col-span-2">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted text-primary">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-base font-semibold">Your data stays with you</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Nimbus runs entirely in your browser. Emails, chat threads, activity, and stats are
                saved to <code className="rounded bg-muted px-1">localStorage</code> and never leave
                your device. You can clear everything from Settings at any time.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <AiDisclaimer />
    </div>
  );
}
