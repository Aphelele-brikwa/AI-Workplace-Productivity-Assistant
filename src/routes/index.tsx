import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bot,
  Calendar,
  Clock,
  Flame,
  Mail,
  Search,
  Sparkles,
  StickyNote,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/StatCard";
import { CircularProgress } from "@/components/common/CircularProgress";
import { PageHeader } from "@/components/common/PageHeader";
import { AiDisclaimer } from "@/components/common/AiDisclaimer";
import {
  STORAGE_KEYS,
  defaultStats,
  readJSON,
  type ActivityItem,
  type Stats,
} from "@/lib/storage";
import { relativeTime } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nimbus AI" },
      {
        name: "description",
        content: "Your AI workspace at a glance: productivity, recent activity, and quick actions.",
      },
    ],
  }),
  component: Dashboard,
});

const tips = [
  "Batch similar tasks together to reduce context switching.",
  "Draft your top 3 priorities before opening your inbox.",
  "Use the AI Chatbot to rehearse tough conversations.",
  "Block 90 minutes of deep work before any meetings.",
];

const quickActions = [
  { title: "Generate Email", icon: Mail, to: "/email", tint: "from-primary to-secondary" },
  { title: "Summarize Notes", icon: StickyNote, to: "/notes", tint: "from-secondary to-accent" },
  { title: "Research Topic", icon: Search, to: "/research", tint: "from-accent to-primary" },
  { title: "Plan Schedule", icon: Calendar, to: "/planner", tint: "from-primary to-accent" },
  { title: "Chat with AI", icon: Bot, to: "/chat", tint: "from-secondary to-primary" },
];

function Dashboard() {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [tip, setTip] = useState(tips[0]);

  useEffect(() => {
    setStats(readJSON<Stats>(STORAGE_KEYS.stats, defaultStats));
    setActivity(readJSON<ActivityItem[]>(STORAGE_KEYS.activity, []));
    setTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <Card className="glass-card relative mb-8 overflow-hidden border-0 p-0">
        <div className="gradient-hero animate-gradient-shift absolute inset-0 opacity-90" />
        <div className="gradient-mesh absolute inset-0 opacity-60" />
        <div className="relative grid gap-6 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-10">
          <div className="min-w-0 text-primary-foreground">
            <Badge className="mb-3 border-white/30 bg-white/15 text-primary-foreground backdrop-blur">
              <Sparkles className="mr-1 h-3 w-3" /> Welcome back
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to make today <span className="italic">effortless</span>?
            </h1>
            <p className="mt-3 max-w-xl text-sm opacity-90 sm:text-base">
              Nimbus AI drafts your emails, summarizes meetings, plans your day, and researches
              topics — all in one calm, purple workspace.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                asChild
                variant="secondary"
                className="rounded-full bg-white text-primary shadow-elegant hover:bg-white/95"
              >
                <Link to="/email">
                  Generate an email <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 text-primary-foreground backdrop-blur hover:bg-white/20"
              >
                <Link to="/chat">Chat with AI</Link>
              </Button>
            </div>
          </div>
          <div className="hidden shrink-0 place-items-center sm:grid">
            <div className="rounded-3xl border border-white/30 bg-white/10 p-4 backdrop-blur-xl">
              <CircularProgress value={78} size={170} label="Productivity" />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Emails Generated" value={stats.emails} icon={Mail} tint="primary" delta="+ Ready to draft" />
        <StatCard label="Tasks Planned" value={stats.tasks} icon={Calendar} tint="secondary" />
        <StatCard label="Research Summaries" value={stats.research} icon={Search} tint="accent" />
        <StatCard label="Meeting Notes" value={stats.notes} icon={StickyNote} tint="primary" />
        <StatCard label="AI Conversations" value={stats.chats} icon={Bot} tint="secondary" />
      </div>

      {/* Quick actions + Productivity */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">Quick actions</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              >
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${a.tint} text-primary-foreground shadow-glow`}
                >
                  <a.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{a.title}</div>
                  <div className="truncate text-xs text-muted-foreground">Open tool</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </Card>

        <Card className="glass-card flex flex-col p-6">
          <div className="mb-4 flex items-center gap-2">
            <Flame className="h-4 w-4 text-accent" />
            <h2 className="text-lg font-semibold">Today's productivity</h2>
          </div>
          <div className="grid place-items-center">
            <CircularProgress value={78} label="On track" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-muted/50 p-2">
              <div className="text-base font-bold">12</div>
              <div className="text-muted-foreground">Tasks done</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-2">
              <div className="text-base font-bold">{stats.emails}</div>
              <div className="text-muted-foreground">Emails</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-2">
              <div className="text-base font-bold">3.2h</div>
              <div className="text-muted-foreground">Saved</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent activity + Tips */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              <h2 className="text-lg font-semibold">Recent activity</h2>
            </div>
          </div>
          {activity.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                Nothing here yet — try generating your first email or starting a chat.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Button asChild size="sm" className="gradient-primary text-primary-foreground">
                  <Link to="/email">Generate email</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/chat">Open chat</Link>
                </Button>
              </div>
            </div>
          ) : (
            <ol className="relative space-y-4 border-l border-border/60 pl-6">
              {activity.slice(0, 8).map((a) => (
                <li key={a.id} className="animate-fade-in relative">
                  <span className="absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full gradient-primary shadow-glow">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                  </span>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0 text-sm font-medium">{a.title}</div>
                    <div className="shrink-0 text-xs text-muted-foreground">
                      {relativeTime(a.createdAt)}
                    </div>
                  </div>
                  <div className="text-xs capitalize text-muted-foreground">{a.type}</div>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card className="glass-card relative overflow-hidden p-6">
          <div className="gradient-mesh absolute inset-0 opacity-70" />
          <div className="relative">
            <Badge className="border-primary/30 bg-primary/15 text-primary">
              <Sparkles className="mr-1 h-3 w-3" /> AI Tip
            </Badge>
            <p className="mt-4 text-base font-semibold leading-snug">{tip}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              A new tip refreshes every time you open the dashboard.
            </p>
            <Button
              asChild
              className="mt-5 w-full gradient-primary text-primary-foreground shadow-glow"
            >
              <Link to="/chat">
                Ask for more <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      <AiDisclaimer />
    </div>
  );
}
