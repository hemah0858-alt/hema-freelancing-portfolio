import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { PageHeader } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getFeedbackPhotoUrl } from "@/lib/feedback-photo.functions";

type Feedback = {
  id: string;
  client_name: string;
  business_name: string;
  rating: number;
  positive_feedback: string;
  project_type: string;
  photo_url: string | null;
};

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Genuine Client Reviews — First Step Future" },
      { name: "description", content: "Approved testimonials from real First Step Future clients. Nothing is invented, and every review was shared with permission." },
      { property: "og:title", content: "Genuine Client Reviews — First Step Future" },
      { property: "og:description", content: "Approved testimonials from real First Step Future clients." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const [reviews, setReviews] = useState<Feedback[]>([]);

  useEffect(() => {
    void supabase
      .from("client_feedback")
      .select("id,client_name,business_name,rating,positive_feedback,project_type,photo_url")
      .eq("status", "approved")
      .eq("permission_to_publish", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReviews(data ?? []));
  }, []);

  return (
    <main>
      <PageHeader
        eyebrow="Client reviews"
        title="Genuine feedback, collected with care."
        copy="Only approved feedback from real client work appears here, and only from clients who gave permission. Nothing is invented."
      />
      <section className="mx-auto max-w-5xl px-5">
        {reviews.length === 0 ? (
          <div className="glass-card text-center">
            <h2 className="font-display text-xl font-bold">No approved reviews yet.</h2>
            <p className="mt-2 text-sm text-muted-foreground">This space will grow naturally as genuine projects are completed.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <article className="glass-card flex flex-col gap-4" key={review.id}>
                {review.photo_url && <FeedbackPhoto path={review.photo_url} />}
                <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed">“{review.positive_feedback}”</blockquote>
                <div className="mt-auto border-t border-border/10 pt-3">
                  <p className="font-display text-sm font-bold">{review.client_name}</p>
                  <p className="text-xs text-muted-foreground">{review.business_name}</p>
                  <p className="mt-1 inline-block rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground">{review.project_type}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="section-wrap">
        <div className="glass-card p-6 text-center md:p-8">
          <h2 className="font-display text-2xl font-bold">Worked with First Step Future?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Your honest feedback — good or constructive — helps the studio improve. It is published only with your permission.</p>
          <Button asChild size="lg" className="mt-5 rounded-xl">
            <Link to="/feedback">Share Your Feedback</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function FeedbackPhoto({ path }: { path: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    void getFeedbackPhotoUrl({ data: { path } }).then((value) => setUrl(value ?? null));
  }, [path]);
  if (!url) return null;
  return <img src={url} alt="" loading="lazy" className="h-14 w-14 rounded-full border border-glass-border object-cover" />;
}
