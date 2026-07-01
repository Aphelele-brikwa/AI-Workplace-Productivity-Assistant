// Mock AI generators — no network calls, deterministic-ish templates.

export type EmailInput = {
  recipient: string;
  subject: string;
  purpose: string;
  keyPoints: string;
  tone: string;
  length: string;
};

const greetings: Record<string, string[]> = {
  Formal: ["Dear", "Good day"],
  Friendly: ["Hi", "Hey"],
  Professional: ["Hello", "Dear"],
  Persuasive: ["Hello", "Dear"],
  Apologetic: ["Dear", "Hello"],
  "Follow-up": ["Hi", "Hello"],
  "Thank You": ["Dear", "Hi"],
};

const closings: Record<string, string[]> = {
  Formal: ["Yours sincerely,", "Kind regards,"],
  Friendly: ["Cheers,", "Talk soon,"],
  Professional: ["Best regards,", "Kind regards,"],
  Persuasive: ["Looking forward to your response,", "Best regards,"],
  Apologetic: ["Sincerely,", "With apologies,"],
  "Follow-up": ["Best,", "Kind regards,"],
  "Thank You": ["With appreciation,", "Warm regards,"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateEmail(input: EmailInput): string {
  const greet = pick(greetings[input.tone] ?? greetings.Professional);
  const close = pick(closings[input.tone] ?? closings.Professional);

  const points = input.keyPoints
    .split(/\n|•|-|;/)
    .map((s) => s.trim())
    .filter(Boolean);

  const opener: Record<string, string> = {
    Formal: `I hope this message finds you well. I am writing regarding ${input.purpose.toLowerCase() || "the matter at hand"}.`,
    Friendly: `Hope you're having a great week! Wanted to reach out about ${input.purpose.toLowerCase() || "something quick"}.`,
    Professional: `I'm reaching out regarding ${input.purpose.toLowerCase() || "an important matter"} and wanted to share a few thoughts.`,
    Persuasive: `I wanted to share an opportunity around ${input.purpose.toLowerCase() || "our recent discussion"} that I believe is worth your attention.`,
    Apologetic: `I want to sincerely apologize regarding ${input.purpose.toLowerCase() || "the recent situation"}, and take responsibility for what happened.`,
    "Follow-up": `Following up on our recent conversation about ${input.purpose.toLowerCase() || "our discussion"} — wanted to check in and share a quick update.`,
    "Thank You": `Thank you so much for ${input.purpose.toLowerCase() || "your time and support"} — it truly meant a lot.`,
  };

  const body =
    points.length > 0
      ? `\n\nA few key points I wanted to highlight:\n${points.map((p) => `  • ${p}`).join("\n")}`
      : "";

  const middle: Record<string, string> = {
    Short: "",
    Medium:
      "\n\nHappy to jump on a quick call or continue the conversation over email — whichever works best on your end.",
    Long: "\n\nHappy to jump on a quick call or continue the conversation over email — whichever works best on your end. I've tried to keep the summary focused, but please don't hesitate to ask if any additional context or supporting detail would be useful. I want to make sure we're aligned before moving to the next step.",
  };

  const closer: Record<string, string> = {
    Formal: "Thank you for your time and consideration.",
    Friendly: "Let me know what you think!",
    Professional: "Looking forward to hearing your thoughts.",
    Persuasive: "I'd love to hear your perspective and explore the next steps together.",
    Apologetic: "Please let me know how I can make things right.",
    "Follow-up": "Just wanted to keep this on your radar — no rush.",
    "Thank You": "Grateful for the opportunity to work with you.",
  };

  return `Subject: ${input.subject || "(no subject)"}\n\n${greet} ${input.recipient || "there"},\n\n${
    opener[input.tone] ?? opener.Professional
  }${body}${middle[input.length] ?? ""}\n\n${closer[input.tone] ?? closer.Professional}\n\n${close}\n[Your Name]`;
}

// Chat responses
const cannedIntros = [
  "Great question — here's how I'd approach that:",
  "Happy to help with that. Here's a quick take:",
  "Absolutely — let's break it down together:",
  "Here's a focused answer for you:",
];

function keywordResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (/email|message|reply|reach out/.test(p)) {
    return `${pick(cannedIntros)}\n\n1. Start with a clear subject line.\n2. Open with a one-line context sentence.\n3. Get to the ask in the second paragraph.\n4. Close with a specific next step and timeline.\n\nWant me to draft a version for you? Head over to the **Smart Email Generator** — you can set the tone and length there.`;
  }
  if (/meeting|notes|summary|summarize/.test(p)) {
    return `${pick(cannedIntros)}\n\nA solid meeting summary should always include:\n\n• **Decisions** made (with owners)\n• **Action items** with deadlines\n• **Risks / open questions**\n• **Next steps** and who owns them\n\nDrop your raw notes into the **Meeting Notes** tool and I'll structure them for you.`;
  }
  if (/plan|schedule|task|day|productiv/.test(p)) {
    return `${pick(cannedIntros)}\n\nStart with 2–3 **most important tasks** (MITs) for the day. Time-box each in the morning while your focus is highest. Batch shallow work (email, reviews) into an afternoon block, and reserve the last hour for planning tomorrow.\n\nTip: protect a 90-minute deep-work block before checking any inbox.`;
  }
  if (/research|topic|article|paper|study/.test(p)) {
    return `${pick(cannedIntros)}\n\nFor efficient research: define the **question** first, then collect 3–5 primary sources, extract quotes into a single doc, and only then write the synthesis. Never start writing before you can state the conclusion in one sentence.`;
  }
  if (/improve|habit|focus|distract/.test(p)) {
    return `${pick(cannedIntros)}\n\nThree levers that compound fast:\n\n1. **Single-tasking** — one tab, one document, timer on.\n2. **A shutdown ritual** — end each day by writing tomorrow's top 3.\n3. **Weekly review** — 30 minutes on Friday to reset priorities.`;
  }
  return `${pick(cannedIntros)}\n\n${prompt.trim()}\n\nLet me expand on that. A helpful next step is to break the goal into a concrete outcome, a deadline, and the one metric that tells you it worked. Want me to help you structure it?`;
}

export function generateChatResponse(prompt: string): string {
  return keywordResponse(prompt);
}
