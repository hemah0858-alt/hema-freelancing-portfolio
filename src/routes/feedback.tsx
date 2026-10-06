import { createFileRoute } from "@tanstack/react-router";
import { projectNameFromSlug } from "@/lib/feedback-projects";
import { PageHeader } from "@/components/site-shell";
import { FeedbackForm } from "@/components/feedback-form";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Share Your Feedback — First Step Future" },
      { name: "description", content: "Worked with First Step Future? Share your experience. Feedback is published only with your permission, after review." },
      { property: "og:title", content: "Share Your Feedback — First Step Future" },
      { property: "og:description", content: "Tell us how your website project went. Published only with your permission." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { project?: string } =>
    typeof search["project"] === "string" && search["project"] ? { project: String(search["project"]).slice(0, 80) } : {},
  component: FeedbackPage,
});

function FeedbackPage() {
  const { project } = Route.useSearch();
  const projectName = project ? projectNameFromSlug(project) : undefined;
  return (
    <main>
      <PageHeader
        eyebrow="Client feedback"
        title="How was your experience with First Step Future?"
        copy="Honest feedback helps this one-person studio grow. It takes about two minutes, and nothing is published without your permission."
      />
      <section className="mx-auto max-w-3xl px-5 pb-8">
        {projectName && <p className="mb-4 rounded-xl bg-primary-soft px-4 py-3 text-sm">Feedback for <strong>{projectName}</strong></p>}
        <FeedbackForm project={projectName} />
      </section>
    </main>
  );
}
