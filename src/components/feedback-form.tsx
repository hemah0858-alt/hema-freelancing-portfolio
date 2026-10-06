import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, Star } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const fieldClass = "mt-2 h-11 rounded-xl border-border/15 bg-surface/70";

const PROJECT_TYPES = [
  "Business website",
  "Restaurant / Café / Cloud kitchen",
  "E-commerce store",
  "Landing page",
  "WordPress website",
  "Website maintenance",
  "Other",
] as const;

export function FeedbackForm({ project }: { project?: string | undefined } = {}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState(false);
  const [recommend, setRecommend] = useState(true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);

  function pickPhoto(event: ChangeEvent<HTMLInputElement>) {
    setPhotoError(null);
    const file = event.target.files?.[0] ?? null;
    if (!file) return setPhoto(null);
    if (!file.type.startsWith("image/")) return setPhotoError("Please choose an image file (JPG, PNG or WebP).");
    if (file.size > 5 * 1024 * 1024) return setPhotoError("Photos must be under 5 MB.");
    setPhoto(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1) return setRatingError(true);
    setRatingError(false);
    setStatus("sending");

    let photoPath: string | null = null;
    if (photo) {
      const extension = photo.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      photoPath = `${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("feedback-uploads").upload(photoPath, photo);
      if (uploadError) {
        setStatus("error");
        return;
      }
    }

    const form = new FormData(event.currentTarget);
    const { error } = await supabase.from("client_feedback").insert({
      client_name: String(form.get("client_name")),
      business_name: String(form.get("business_name")),
      email: String(form.get("email") || "") || null,
      rating,
      positive_feedback: String(form.get("positive_feedback")),
      improvement_feedback: String(form.get("improvement_feedback") || "") || null,
      project_type: String(form.get("project_type")),
      project_name: String(form.get("project_name") || "").trim().slice(0, 120) || null,
      would_recommend: recommend,
      permission_to_publish: form.get("permission_to_publish") === "on",
      photo_url: photoPath,
    });

    if (error) {
      if (photoPath) void supabase.storage.from("feedback-uploads").remove([photoPath]);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="glass-card text-center">
        <CheckCircle2 className="mx-auto size-9 text-primary" />
        <h2 className="mt-4 font-display text-xl font-bold">Thank you for your feedback!</h2>
        <p className="mt-2 text-sm text-muted-foreground">Your response has been received. Hemasri will review it before anything appears on the website.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-card grid gap-5 p-6 md:grid-cols-2 md:p-8">
      <Field label="Your name" name="client_name" required maxLength={100} />
      <Field label="Business name" name="business_name" required maxLength={160} />
      <Field label="Email (optional)" name="email" type="email" maxLength={255} />

      <div>
        <Label>Rating</Label>
        <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Rating from 1 to 5 stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              aria-pressed={rating === value}
              onClick={() => { setRating(value); setRatingError(false); }}
            >
              <Star className={value <= rating ? "fill-primary text-primary" : "text-muted-foreground"} />
            </Button>
          ))}
        </div>
        {ratingError && <p className="mt-1.5 text-xs text-destructive">Please choose a star rating.</p>}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="positive_feedback">What did you like about the service?</Label>
        <Textarea
          id="positive_feedback"
          name="positive_feedback"
          required
          minLength={10}
          maxLength={2000}
          className="mt-2 min-h-28 rounded-xl border-border/15 bg-surface/70"
          placeholder="Communication, design, speed, support…"
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="improvement_feedback">What could we improve? <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <Textarea
          id="improvement_feedback"
          name="improvement_feedback"
          maxLength={2000}
          className="mt-2 min-h-20 rounded-xl border-border/15 bg-surface/70"
          placeholder="Anything that would have made the experience better."
        />
      </div>

      <div>
        <Label htmlFor="project_name">Project / website name</Label>
        <input id="project_name" name="project_name" defaultValue={project ?? ""} maxLength={120} placeholder="e.g. RJ Coir" className={`${fieldClass} w-full border px-3 text-sm`} />
      </div>

      <div>
        <Label htmlFor="project_type">Project type</Label>
        <select
          id="project_type"
          name="project_type"
          required
          className={`${fieldClass} w-full appearance-none rounded-xl border border-border/15 bg-surface/70 px-3 text-sm`}
          defaultValue=""
        >
          <option value="" disabled>Select a project type</option>
          {PROJECT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      <div>
        <Label>Would you recommend First Step Future?</Label>
        <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Would you recommend First Step Future?">
          <Button type="button" variant={recommend ? "default" : "outline"} aria-pressed={recommend} onClick={() => setRecommend(true)} className="flex-1 rounded-xl">Yes</Button>
          <Button type="button" variant={!recommend ? "default" : "outline"} aria-pressed={!recommend} onClick={() => setRecommend(false)} className="flex-1 rounded-xl">No</Button>
        </div>
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="photo">Your photo or business logo <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <Input
          id="photo"
          ref={photoInput}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={pickPhoto}
          className="mt-2 h-11 cursor-pointer rounded-xl border-border/15 bg-surface/70 file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-xs file:font-semibold"
        />
        {photoError && <p className="mt-1.5 text-xs text-destructive">{photoError}</p>}
        <p className="mt-1.5 text-xs text-muted-foreground">JPG, PNG or WebP, up to 5 MB. Shown with your review only after your approval.</p>
      </div>

      <label className="flex items-start gap-3 md:col-span-2">
        <input type="checkbox" name="permission_to_publish" required className="mt-1 size-4 shrink-0 rounded accent-[var(--primary)]" />
        <span className="text-sm leading-relaxed">
          I give permission for First Step Future to display my feedback on its website and marketing materials.
        </span>
      </label>

      {status === "error" && (
        <p className="text-sm text-destructive md:col-span-2">Your feedback could not be sent. Please try again, or reach out on WhatsApp.</p>
      )}

      <div className="md:col-span-2">
        <Button type="submit" size="lg" className="w-full rounded-xl sm:w-auto" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Submit Feedback"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">Feedback is checked before it is published. Nothing appears publicly without your permission.</p>
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", required, maxLength, placeholder }: { label: string; name: string; type?: string; required?: boolean; maxLength?: number; placeholder?: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} required={required} maxLength={maxLength} placeholder={placeholder} className={fieldClass} />
    </div>
  );
}
