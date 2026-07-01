import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { AiDisclaimer } from "@/components/common/AiDisclaimer";
import { OutputToolbar } from "@/components/common/OutputToolbar";
import { generateEmail, type EmailInput } from "@/lib/mock-ai";
import {
  STORAGE_KEYS,
  incrementStat,
  pushActivity,
  readJSON,
  writeJSON,
  type EmailHistoryItem,
} from "@/lib/storage";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Nimbus AI" },
      {
        name: "description",
        content: "Draft polished, on-tone emails in seconds with the Nimbus AI email generator.",
      },
    ],
  }),
  component: EmailPage,
});

const tones = ["Formal", "Friendly", "Professional", "Persuasive", "Apologetic", "Follow-up", "Thank You"];
const lengths = ["Short", "Medium", "Long"];

function EmailPage() {
  const [form, setForm] = useState<EmailInput>({
    recipient: "",
    subject: "",
    purpose: "",
    keyPoints: "",
    tone: "Professional",
    length: "Medium",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const update = <K extends keyof EmailInput>(k: K, v: EmailInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const run = async () => {
    if (!form.recipient.trim() || !form.subject.trim() || !form.purpose.trim()) {
      toast.error("Please fill in recipient, subject, and purpose.");
      return;
    }
    setLoading(true);
    setOutput("");
    await new Promise((r) => setTimeout(r, 700));
    const text = generateEmail(form);
    setOutput(text);
    setLoading(false);

    const item: EmailHistoryItem = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      recipient: form.recipient,
      subject: form.subject,
      tone: form.tone,
      length: form.length,
      content: text,
    };
    const list = readJSON<EmailHistoryItem[]>(STORAGE_KEYS.emailHistory, []);
    list.unshift(item);
    writeJSON(STORAGE_KEYS.emailHistory, list.slice(0, 50));
    incrementStat("emails");
    pushActivity({ type: "email", title: `Email drafted: ${form.subject}` });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Smart Email"
        title="Smart Email Generator"
        description="Structured inputs in, a polished, editable draft out — every time."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Compose</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient name</Label>
              <Input
                id="recipient"
                value={form.recipient}
                onChange={(e) => update("recipient", e.target.value)}
                placeholder="e.g. Priya Sharma"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="e.g. Project kickoff — next steps"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                value={form.purpose}
                onChange={(e) => update("purpose", e.target.value)}
                placeholder="What is this email about?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyPoints">Key points</Label>
              <Textarea
                id="keyPoints"
                value={form.keyPoints}
                onChange={(e) => update("keyPoints", e.target.value)}
                placeholder="One idea per line — the AI will structure them for you."
                rows={5}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={form.tone} onValueChange={(v) => update("tone", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={form.length} onValueChange={(v) => update("length", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {lengths.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={run}
              disabled={loading}
              className="w-full gradient-primary text-primary-foreground shadow-glow"
            >
              <Wand2 className="h-4 w-4" />
              {loading ? "Generating…" : "Generate email"}
            </Button>
          </div>
        </Card>

        {/* Output */}
        <Card className="glass-card flex flex-col p-6 lg:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h2 className="text-base font-semibold">Draft</h2>
          </div>

          {loading ? (
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your generated email will appear here — fully editable."
              className="min-h-[360px] flex-1 resize-none rounded-2xl border-border/60 bg-background/50 font-mono text-sm leading-relaxed"
            />
          )}

          <div className="mt-4">
            <OutputToolbar
              text={output}
              filename={`email-${Date.now()}.txt`}
              onRegenerate={run}
              onClear={() => setOutput("")}
              disabled={loading}
            />
          </div>
        </Card>
      </div>

      <AiDisclaimer />
    </div>
  );
}
