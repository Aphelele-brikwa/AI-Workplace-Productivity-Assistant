// Client-only localStorage helpers with SSR guards.

const isBrowser = () => typeof window !== "undefined";

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export function removeKey(key: string): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
}

// Domain types
export type EmailHistoryItem = {
  id: string;
  createdAt: number;
  recipient: string;
  subject: string;
  tone: string;
  length: string;
  content: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

export type ChatThread = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

export type Stats = {
  emails: number;
  tasks: number;
  research: number;
  notes: number;
  chats: number;
};

export type ActivityItem = {
  id: string;
  type: "email" | "chat" | "task" | "notes" | "research";
  title: string;
  createdAt: number;
};

export const STORAGE_KEYS = {
  emailHistory: "lovable:history:email",
  chatThreads: "lovable:chat:threads",
  stats: "lovable:stats",
  activity: "lovable:activity",
  theme: "lovable:theme",
} as const;

export const defaultStats: Stats = {
  emails: 0,
  tasks: 0,
  research: 0,
  notes: 0,
  chats: 0,
};

export function incrementStat(key: keyof Stats, by = 1) {
  const s = readJSON<Stats>(STORAGE_KEYS.stats, defaultStats);
  s[key] = (s[key] ?? 0) + by;
  writeJSON(STORAGE_KEYS.stats, s);
  return s;
}

export function pushActivity(item: Omit<ActivityItem, "id" | "createdAt">) {
  const list = readJSON<ActivityItem[]>(STORAGE_KEYS.activity, []);
  const next: ActivityItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  list.unshift(next);
  writeJSON(STORAGE_KEYS.activity, list.slice(0, 30));
}
