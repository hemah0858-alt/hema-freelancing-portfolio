import { whatsappLink } from "@/components/whatsapp-button";
import { createFileRoute } from "@tanstack/react-router";
import { WebsiteRequestForm } from "@/components/forms";
import { PageHeader } from "@/components/site-shell";

export const Route = createFileRoute("/request-website")({
  head: () => ({
    meta: [
      { title: "Request a Website — First Step Future" },
      { name: "description", content: "Tell Hemasri about your business and get the best website option. Websites start from ₹6,500." },
      { property: "og:title", content: "Request a Website — First Step Future" },
      { property: "og:description", content: "Share your business details and get a website recommendation from First Step Future." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RequestWebsite,
});

function RequestWebsite() {
  return (
    <main>
      <PageHeader eyebrow="Request a website" title="Let's Build Your Website" copy="Tell me about your business and I'll get back to you with the best website option." />
      <section className="relative mx-auto max-w-3xl px-5"><WebsiteRequestForm /><p className="mt-5 text-center text-sm text-muted-foreground">Prefer to chat? <a className="font-semibold text-primary underline-offset-4 hover:underline" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Message Hemasri on WhatsApp</a></p></section>
    </main>
  );
}
