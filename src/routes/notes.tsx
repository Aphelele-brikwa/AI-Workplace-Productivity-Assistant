import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes — Nimbus AI" },
      { name: "description", content: "Turn raw meeting notes into decisions, action items, and next steps." },
    ],
  }),
  component: () => (
    <ComingSoon
      eyebrow="Meeting Notes"
      title="Meeting Notes Summarizer"
      description="Paste raw notes and get structured summaries with decisions, action items, deadlines, and risks."
    />
  ),
});
