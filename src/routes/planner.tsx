import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Nimbus AI" },
      { name: "description", content: "Organize tasks, prioritize urgent work, and balance your day." },
    ],
  }),
  component: () => (
    <ComingSoon
      eyebrow="Task Planner"
      title="AI Task Planner"
      description="Enter tasks, priorities, and working hours — get a balanced daily or weekly schedule."
    />
  ),
});
