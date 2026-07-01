import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Nimbus AI" },
      { name: "description", content: "Summarize research with key findings, pros, cons, and recommendations." },
    ],
  }),
  component: () => (
    <ComingSoon
      eyebrow="Research"
      title="AI Research Assistant"
      description="Enter a topic or article and get a clean summary of key findings, pros, cons, and next steps."
    />
  ),
});
