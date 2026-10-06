import { WhatsAppButton, serviceMessage } from "@/components/whatsapp-button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, Briefcase, Camera, Check, IdCard, Info, LayoutTemplate, MapPin, MessageCircle, Palette, QrCode, Rocket, ShoppingCart, UtensilsCrossed, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionHeading } from "@/components/site-shell";
import { benefits, digitalServices, serviceCatalog, type DigitalIcon, type ServiceIcon } from "@/lib/site-data";
const icons: Record<ServiceIcon, typeof Briefcase> = {
  briefcase: Briefcase,
  utensils: UtensilsCrossed,
  cart: ShoppingCart,
  rocket: Rocket,
  layout: LayoutTemplate,
  wrench: Wrench,
};
const digitalIcons: Record<DigitalIcon, typeof Briefcase> = {
  palette: Palette, idcard: IdCard, "map-pin": MapPin,
  camera: Camera, "qr-code": QrCode, whatsapp: MessageCircle,
};

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Website Services & Pricing — First Step Future" },
      { name: "description", content: "Business, restaurant, e-commerce, landing page and WordPress websites from ₹3,000, plus website maintenance." },
      { property: "og:title", content: "Website Services & Pricing — First Step Future" },
      { property: "og:description", content: "Mobile-first websites for local businesses with clear starting prices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <main>
      <PageHeader eyebrow="Services" title="The right website for your next stage." copy="Practical, mobile-first websites with clear starting prices. Final quotes depend on your project." />
      <section className="mx-auto grid max-w-6xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
        {serviceCatalog.map((s) => {
          const Icon = icons[s.icon];
          return (
            <article className="glass-card flex flex-col" key={s.title}>
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" aria-hidden /></span>
              <h2 className="mt-4 font-display text-xl font-bold">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <p className="mt-4 font-display text-lg font-bold text-primary">{s.price}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {s.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />{f}</li>
                ))}
              </ul>
              <div className="mt-6 grid gap-2"><Button asChild className="rounded-xl"><Link to="/request-website">Request a Website</Link></Button><WhatsAppButton message={serviceMessage(s.title)}>Ask on WhatsApp</WhatsAppButton></div>
            </article>
          );
        })}
      </section>
      <section className="mx-auto mt-6 max-w-6xl px-5">
        <div className="flex gap-3 rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <p>Prices shown are starting prices for website design and development. Domain and hosting charges may be separate depending on the project — these will be clearly explained in your quote.</p>
        </div>
      </section>
      <section id="digital-services" className="section-wrap scroll-mt-28">
  <SectionHeading label="More than just websites" title="Affordable digital services" copy="Help your business look professional and reach more customers online — with or without a new website." />
  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {digitalServices.map((s) => {
      const Icon = digitalIcons[s.icon];
      return (
        <article className="glass-card flex flex-col" key={s.title}>
          <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" aria-hidden /></span>
          <h2 className="mt-4 font-display text-xl font-bold">{s.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
          <p className="mt-4 font-display text-lg font-bold text-primary">{s.price}</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm">
            {s.features.map((f) => (
              <li key={f} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />{f}</li>
            ))}
          </ul>
          <div className="mt-6 grid gap-2"><Button asChild className="rounded-xl"><Link to="/request-website">Get Started</Link></Button><WhatsAppButton message={serviceMessage(s.title)}>Ask on WhatsApp</WhatsAppButton></div>
        </article>
      );
    })}
  </div>
</section>
      <section className="section-wrap">
        <h2 className="font-display text-2xl font-bold">Included in every website</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {benefits.map(([, title, copy]) => (
            <div className="glass-card" key={title}><h3 className="font-display font-bold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{copy}</p></div>
          ))}
        </div>
        <Button asChild size="lg" className="mt-7 rounded-xl"><Link to="/request-website">Request a Free Demo</Link></Button>
      </section>
    </main>
  );
}
