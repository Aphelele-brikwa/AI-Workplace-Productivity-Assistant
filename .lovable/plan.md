
## AI Workplace Productivity Assistant — Phase 1

Frontend-only build. No backend, no auth, no Lovable Cloud. Mock AI responses. History persisted in localStorage.

### Scope (Phase 1)
- Dashboard home
- Smart Email Generator
- AI Chatbot
- Shell for Meeting Notes / Task Planner / Research (placeholder "Coming soon" routes so sidebar links resolve)

### Design System
- Purple #7C3AED primary, Indigo #6366F1 secondary, Pink #EC4899 accent
- Light bg #F8FAFC / #FFFFFF, Dark bg #0F172A / #111827
- Inter via `@fontsource/inter`
- Tokens in `src/styles.css` under `@theme inline` (oklch); gradients, glass, soft shadows, 20px radius as CSS custom properties
- Dark mode via `next-themes`-style class toggle (custom minimal implementation, no extra dep)
- Custom scrollbar, animated gradient background utility, glass card utility (`@utility glass-card`)

### Routes (TanStack Start, file-based)
```
src/routes/
  __root.tsx              → Inter font link, updated meta, sidebar layout wrapper
  index.tsx               → Dashboard
  email.tsx               → Smart Email Generator
  chat.tsx                → AI Chatbot
  notes.tsx               → Coming soon
  planner.tsx             → Coming soon
  research.tsx            → Coming soon
  settings.tsx            → Theme toggle, clear history
  help.tsx                → Static help/FAQ
```
Each route gets its own `head()` with unique title/description.

### Layout
- `AppShell` component in `src/components/layout/` renders `SidebarProvider` + `AppSidebar` + header (theme toggle, search input, notification bell, profile menu) + `<Outlet />`.
- Applied inside `__root.tsx`'s RootComponent so every route shares it.
- Sidebar uses shadcn `Sidebar` with `collapsible="icon"`; mobile becomes drawer automatically. Active link via `useRouterState`.

### Dashboard (`/`)
- 5 stat cards (Emails, Tasks, Research, Notes, Conversations) — counts pulled from localStorage
- Quick Actions grid (5 gradient buttons linking to features)
- Today's Productivity — circular SVG progress at 78% + 3 sub-metrics
- Recent Activity timeline (from localStorage, newest first, animated fade-in)
- AI Tips card with rotating tip

### Smart Email Generator (`/email`)
- React Hook Form + Zod validation: recipient, subject, purpose, key points, tone (Select), length (Select)
- "Generate Email" → mock generator function that composes a templated email using inputs + tone/length modifiers, with a simulated typing delay + skeleton
- Editable Textarea output with char/word counter
- Buttons: Copy (sonner toast), Regenerate, Clear, Download .txt
- Saves each generation to localStorage history (`lovable:history:email`)
- Responsible AI disclaimer at bottom

### AI Chatbot (`/chat`)
- ChatGPT-style: message list with user/assistant bubbles (assistant no bg, user filled purple with white text), typing indicator, auto-scroll to bottom, purple gradient send button
- Textarea composer (Enter to send, Shift+Enter newline)
- Mock assistant: canned responses keyed off keywords (email/meeting/plan/research/productivity) + generic fallback, streamed char-by-char via `setInterval` for typing feel
- Example prompt chips when empty
- Sidebar within chat: conversation list stored in localStorage, New Chat, Clear Chat, per-message Copy + Regenerate
- Uses simple in-page thread list (not multi-route) — one-conversation-at-a-time UX with a switcher, since we chose localStorage only

### Mock AI
- `src/lib/mock-ai.ts` — pure functions returning strings; deterministic-ish templates with light randomness so Regenerate feels different
- No API key, no network calls

### Persistence
- `src/lib/storage.ts` — typed getters/setters with SSR guard (`typeof window`)
- Keys: `lovable:history:email`, `lovable:chat:threads`, `lovable:stats`, `lovable:theme`
- Stats increment on each generation for dashboard cards

### Components (shadcn — already installed)
Sidebar, Button, Card, Input, Textarea, Select, Label, Badge, Tabs, Tooltip, Dialog, Sonner (toasts), Progress, Skeleton, ScrollArea, DropdownMenu, Separator, Avatar. All present in `src/components/ui/`.

### Animations
Tailwind + existing `tw-animate-css`: fade-in, slide-up, scale-in on cards; hover elevation on cards; button gradient shift on hover; typing dots keyframe; animated conic gradient behind hero on dashboard.

### Files to create
- `src/lib/mock-ai.ts`, `src/lib/storage.ts`, `src/lib/format.ts`
- `src/components/layout/AppShell.tsx`, `AppSidebar.tsx`, `AppHeader.tsx`, `ThemeToggle.tsx`
- `src/components/common/StatCard.tsx`, `SectionHeader.tsx`, `AiDisclaimer.tsx`, `CircularProgress.tsx`, `EmptyState.tsx`
- `src/components/chat/ChatWindow.tsx`, `MessageBubble.tsx`, `Composer.tsx`, `ThreadList.tsx`
- `src/hooks/useTheme.ts`, `src/hooks/useHistory.ts`, `src/hooks/useStats.ts`
- Routes listed above

### Files to modify
- `src/styles.css` — purple palette (light + dark), gradients, glass utility, custom scrollbar, Inter as `--font-sans`
- `src/routes/__root.tsx` — real title/description/OG, Inter fontsource import, wrap in AppShell + ThemeProvider, remove default NotFound styling only if needed
- `src/routes/index.tsx` — replace placeholder with Dashboard
- Install: `bun add @fontsource/inter react-hook-form zod @hookform/resolvers`

### Out of scope for Phase 1 (stubbed)
Meeting Notes, Task Planner, Research Assistant → routes exist with "Coming in the next iteration" empty state so sidebar nav works cleanly. Can be built out in a follow-up turn using the same patterns as the Email Generator.

### Deliverable check
- Purple glassmorphic UI, dark mode toggle, responsive sidebar → drawer
- Dashboard + Email + Chat fully interactive with mock AI
- All outputs editable with Copy / Regenerate / Clear / Download
- Disclaimer on every AI page
- History persists across reloads via localStorage
