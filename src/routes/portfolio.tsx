import { WhatsAppButton, projectMessage } from "@/components/whatsapp-button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import coir from "@/assets/project-coir.jpg";
import cafe from "@/assets/project-cafe.jpg";
import gym from "@/assets/project-gym.jpg";
import travel from "@/assets/project-travel.jpg";
import boutique from "@/assets/project-boutique.jpg";
import watersports from "@/assets/project-watersports.jpg";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site-shell";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio & Website Samples — First Step Future" },
      { name: "description", content: "Explore real work and clearly labelled website concepts for restaurants, gyms, travel, e-commerce and more by First Step Future." },
      { property: "og:title", content: "Portfolio & Website Samples — First Step Future" },
      { property: "og:description", content: "Real client work and clearly labelled demo concepts showing the quality and range available." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

type Project = {
  image: string;
  name: string;
  category: string;
  filter: string;
  description: string;
  tech: string[];
  url?: string | undefined;
  firstProject?: boolean;
};

const projects: Project[] = [
  {
    image: coir,
    name: "RJ Coir",
    category: "Coir / Manufacturing",
    filter: "Business",
    description: "Professional business website for a cocopeat and coir exporter.",
    tech: ["Responsive design", "Product catalogue", "Export enquiry forms"],
    url: "https://www.rjcoir.com/",
    firstProject: true,
  },
  {
    image: cafe,
    name: "Restaurant Website Demo",
    category: "Restaurant",
    filter: "Restaurant",
    description: "Modern restaurant website concept with menu, location and WhatsApp contact.",
    tech: ["Menu showcase", "Google Maps", "WhatsApp ordering"],
  },
  {
    image: gym,
    name: "Gym Website Demo",
    category: "Fitness",
    filter: "Fitness",
    description: "Professional gym website concept with services, membership CTA and contact information.",
    tech: ["Class schedules", "Membership CTA", "Lead capture"],
  },
  {
    image: travel,
    name: "Travel Agency Demo",
    category: "Travel",
    filter: "Travel",
    description: "Responsive travel agency website concept.",
    tech: ["Tour packages", "Search & filters", "Booking enquiry"],
  },
  {
    image: boutique,
    name: "E-commerce Demo",
    category: "E-commerce",
    filter: "E-commerce",
    description: "Product-focused e-commerce website concept.",
    tech: ["Product grid", "Cart concept", "WhatsApp checkout"],
  },
  {
    image: watersports,
    name: "Water Sports Demo",
    category: "Tourism / Water Sports",
    filter: "Travel",
    description: "Modern website concept for a water sports business.",
    tech: ["Activity booking", "Gallery", "Availability checker"],
  },
];

const filters = ["All", "Business", "Restaurant", "Fitness", "Travel", "E-commerce"] as const;

function Portfolio() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [added, setAdded] = useState<Project[]>([]);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (!data) return;
      const mapped = await Promise.all(
        data.map(async (p): Promise<Project> => {
          let image = "";
          if (p.image_path) {
            const { data: s } = await supabase.storage.from("portfolio-images").createSignedUrl(p.image_path, 60 * 60 * 24);
            image = s?.signedUrl ?? "";
          }
          const match = filters.find((f) => f !== "All" && p.category.toLowerCase().includes(f.toLowerCase()));
          return { image, name: p.name, category: p.category, filter: match ?? "Business", description: p.description, tech: p.is_featured ? ["Featured"] : [], url: p.website_url ?? undefined };
        }),
      );
      setAdded(mapped);
    })();
  }, []);

  const all: Project[] = [...projects.slice(0, 1), ...added, ...projects.slice(1)];
  const visible = active === "All" ? all : all.filter((p) => p.filter === active);

  return (
    <main>
      <PageHeader
        eyebrow="Portfolio"
        title="Real work and honest sample concepts."
        copy="RJ Coir is my first project — a live client website. The rest are clearly labelled demo concepts that show the quality and range you can expect; real work will replace them as the portfolio grows."
      />

      <section className="mx-auto max-w-5xl px-5">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by category">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-glass-border bg-glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <article
              key={p.name}
              className={`flex flex-col overflow-hidden rounded-2xl border bg-glass transition-transform duration-300 hover:-translate-y-1 ${p.firstProject ? "border-primary/40 ring-1 ring-primary/15" : "border-glass-border"}`}
            >
              {p.image ? (
                <img
                  src={p.image}
                  width={944}
                  height={704}
                  loading="lazy"
                  alt={`${p.name} website preview`}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-primary-soft font-display text-lg font-bold text-primary">{p.name}</div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="eyebrow text-primary">{p.category}</p>
                  {p.firstProject && (
                    <span className="rounded-full border border-primary/30 bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      My First Project
                    </span>
                  )}
                  {!p.url && (
                    <span className="rounded-full border border-glass-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Demo Project
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-display text-lg font-bold">{p.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <li key={t} className="rounded-md bg-primary-soft px-2 py-1 text-[11px] font-medium text-foreground">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-2">
                  {p.url ? (
                    <Button asChild variant="outline" className="w-full rounded-xl">
                      <a href={p.url} target="_blank" rel="noopener noreferrer">
                        View Website <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full rounded-xl">
                      <Link to="/request-website">Request a Demo Like This</Link>
                    </Button>
                  )}
                  <WhatsAppButton message={projectMessage(p.name)} variant="ghost" className="mt-2 w-full text-primary">Ask about a similar site</WhatsAppButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap rounded-3xl border border-glass-border bg-primary-soft p-7 text-center">
        <h2 className="font-display text-2xl font-bold">Want a website like this?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Tell me about your business and I'll prepare a free, no-obligation demo concept for you.
        </p>
        <Button asChild size="lg" className="mt-5 rounded-xl">
          <Link to="/request-website">Get a Free Website Demo</Link>
        </Button>
      </section>
    </main>
  );
}
