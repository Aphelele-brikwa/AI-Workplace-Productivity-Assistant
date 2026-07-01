import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Copy,
  MessageSquarePlus,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/common/PageHeader";
import { AiDisclaimer } from "@/components/common/AiDisclaimer";
import { generateChatResponse } from "@/lib/mock-ai";
import {
  STORAGE_KEYS,
  incrementStat,
  pushActivity,
  readJSON,
  writeJSON,
  type ChatMessage,
  type ChatThread,
} from "@/lib/storage";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Nimbus AI" },
      {
        name: "description",
        content: "Chat with your workplace productivity assistant — drafts, plans, and research on demand.",
      },
    ],
  }),
  component: ChatPage,
});

const examples = [
  "Write an email to reschedule a meeting",
  "Summarize this meeting's key decisions",
  "Plan my day around 3 deep-work blocks",
  "Research the latest on AI productivity tools",
  "Help me improve my focus at work",
];

function newThread(): ChatThread {
  const now = Date.now();
  return { id: crypto.randomUUID(), title: "New conversation", createdAt: now, updatedAt: now, messages: [] };
}

function ChatPage() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const scrollBottomRef = useRef<HTMLDivElement>(null);

  // Load / bootstrap
  useEffect(() => {
    const stored = readJSON<ChatThread[]>(STORAGE_KEYS.chatThreads, []);
    if (stored.length === 0) {
      const t = newThread();
      setThreads([t]);
      setActiveId(t.id);
      writeJSON(STORAGE_KEYS.chatThreads, [t]);
    } else {
      setThreads(stored);
      setActiveId(stored[0].id);
    }
  }, []);

  useEffect(() => {
    composerRef.current?.focus();
  }, [activeId]);

  const active = useMemo(
    () => threads.find((t) => t.id === activeId) ?? null,
    [threads, activeId],
  );

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, streaming]);

  const persist = (next: ChatThread[]) => {
    setThreads(next);
    writeJSON(STORAGE_KEYS.chatThreads, next);
  };

  const updateActive = (updater: (t: ChatThread) => ChatThread) => {
    if (!activeId) return;
    persist(threads.map((t) => (t.id === activeId ? updater(t) : t)));
  };

  const startNew = () => {
    const t = newThread();
    const next = [t, ...threads];
    persist(next);
    setActiveId(t.id);
    setInput("");
  };

  const deleteThread = (id: string) => {
    const next = threads.filter((t) => t.id !== id);
    if (next.length === 0) {
      const t = newThread();
      persist([t]);
      setActiveId(t.id);
    } else {
      persist(next);
      if (id === activeId) setActiveId(next[0].id);
    }
  };

  const streamResponse = async (prompt: string, threadId: string) => {
    setStreaming(true);
    const full = generateChatResponse(prompt);
    const assistantId = crypto.randomUUID();

    // seed empty assistant message
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: [
                ...t.messages,
                { id: assistantId, role: "assistant", content: "", createdAt: Date.now() },
              ],
            }
          : t,
      ),
    );

    // stream chars
    const step = Math.max(2, Math.floor(full.length / 80));
    for (let i = 0; i <= full.length; i += step) {
      await new Promise((r) => setTimeout(r, 22));
      const slice = full.slice(0, i);
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: t.messages.map((m) =>
                  m.id === assistantId ? { ...m, content: slice } : m,
                ),
              }
            : t,
        ),
      );
    }

    // finalize and persist
    setThreads((prev) => {
      const next = prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              updatedAt: Date.now(),
              messages: t.messages.map((m) =>
                m.id === assistantId ? { ...m, content: full } : m,
              ),
            }
          : t,
      );
      writeJSON(STORAGE_KEYS.chatThreads, next);
      return next;
    });
    setStreaming(false);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || !active || streaming) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    const wasEmpty = active.messages.length === 0;
    updateActive((t) => ({
      ...t,
      title: wasEmpty ? text.slice(0, 40) : t.title,
      updatedAt: Date.now(),
      messages: [...t.messages, userMsg],
    }));
    setInput("");
    if (wasEmpty) {
      incrementStat("chats");
      pushActivity({ type: "chat", title: `Started chat: ${text.slice(0, 40)}` });
    }
    await streamResponse(text, active.id);
  };

  const regenerateLast = async () => {
    if (!active || streaming) return;
    // find last user message
    const lastUser = [...active.messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    // drop trailing assistant if any
    updateActive((t) => {
      const msgs = [...t.messages];
      while (msgs.length && msgs[msgs.length - 1].role === "assistant") msgs.pop();
      return { ...t, messages: msgs };
    });
    await streamResponse(lastUser.content, active.id);
  };

  const clearActive = () => {
    updateActive((t) => ({ ...t, messages: [], title: "New conversation" }));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="AI Chatbot"
        title="Chat with Nimbus"
        description="Ask about emails, meetings, planning, or research — your workplace copilot is ready."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={startNew}>
              <MessageSquarePlus className="h-4 w-4" /> New chat
            </Button>
            <Button variant="ghost" size="sm" onClick={clearActive} disabled={!active?.messages.length}>
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
          </>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Thread list */}
        <Card className="glass-card hidden h-fit p-3 lg:block">
          <div className="px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground">
            Conversations
          </div>
          <div className="space-y-1">
            {threads.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "group flex items-center gap-2 rounded-xl px-2 py-2 transition-colors",
                  t.id === activeId ? "bg-primary/15 text-foreground" : "hover:bg-muted/50",
                )}
              >
                <button
                  onClick={() => setActiveId(t.id)}
                  className="flex min-w-0 flex-1 items-start gap-2 text-left"
                >
                  <Bot className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{t.title}</div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {relativeTime(t.updatedAt)}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => deleteThread(t.id)}
                  aria-label="Delete conversation"
                  className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat window */}
        <Card className="glass-card flex h-[calc(100vh-16rem)] min-h-[520px] flex-col overflow-hidden p-0">
          <ScrollArea className="flex-1">
            <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8">
              {!active?.messages.length ? (
                <div className="grid place-items-center py-12 text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow">
                    <Sparkles className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">How can I help you today?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try one of these prompts to get started.
                  </p>
                  <div className="mt-5 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                    {examples.map((ex) => (
                      <button
                        key={ex}
                        onClick={() => setInput(ex)}
                        className="rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {active.messages.map((m) => (
                    <MessageRow key={m.id} message={m} />
                  ))}
                  {streaming && <TypingIndicator />}
                  {!streaming && active.messages.length > 0 && (
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm" onClick={regenerateLast}>
                        <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                      </Button>
                    </div>
                  )}
                  <div ref={scrollBottomRef} />
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Composer */}
          <div className="border-t border-border/60 bg-background/60 p-3 backdrop-blur-xl sm:p-4">
            <div className="mx-auto max-w-3xl">
              <div className="relative rounded-2xl border border-border/60 bg-card/70 p-2 shadow-soft focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20">
                <Textarea
                  ref={composerRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Message Nimbus…  (Enter to send, Shift+Enter for new line)"
                  rows={2}
                  className="min-h-[52px] resize-none border-0 bg-transparent pr-14 shadow-none focus-visible:ring-0"
                />
                <Button
                  size="icon"
                  onClick={send}
                  disabled={!input.trim() || streaming}
                  aria-label="Send message"
                  className="absolute bottom-2 right-2 h-10 w-10 rounded-xl gradient-primary text-primary-foreground shadow-glow"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <AiDisclaimer />
    </div>
  );
}

function MessageRow({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-full",
          isUser ? "bg-secondary text-secondary-foreground" : "gradient-primary text-primary-foreground shadow-glow",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn("group min-w-0 max-w-[80%]", isUser ? "items-end text-right" : "items-start")}>
        {isUser ? (
          <div className="inline-block rounded-2xl rounded-tr-md gradient-primary px-4 py-2.5 text-left text-sm text-primary-foreground shadow-soft">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {message.content || <span className="text-muted-foreground">…</span>}
            </p>
          </div>
        )}
        {!isUser && message.content && (
          <div className="mt-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(message.content);
                toast.success("Message copied");
              }}
            >
              <Copy className="h-3 w-3" /> Copy
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="grid h-8 w-8 place-items-center rounded-full gradient-primary text-primary-foreground shadow-glow">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl bg-muted/50 px-4 py-3">
        <span className="animate-typing-dot h-2 w-2 rounded-full bg-primary" />
        <span className="animate-typing-dot h-2 w-2 rounded-full bg-primary" style={{ animationDelay: "0.15s" }} />
        <span className="animate-typing-dot h-2 w-2 rounded-full bg-primary" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
}
