import { WhatsAppButton } from "@/components/whatsapp-button";
import { createFileRoute, Link } from "@tanstack/react-router";

import workspaceImage from "@/assets/portfolio-workspace.jpg";
import cafeImage from "@/assets/project-cafe.jpg";
import gymImage from "@/assets/project-gym.jpg";
import boutiqueImage from "@/assets/project-boutique.jpg";
import coirImage from "@/assets/project-coir.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site-shell";
import { benefits, process, services } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "First Step Future — Professional Websites for Growing Businesses" },
    { name: "description", content: "Affordable, responsive website development by Hemasri for small businesses in India and worldwide. Websites from ₹6,500." },
    { property: "og:title", content: "First Step Future — Professional Websites for Growing Businesses" },
    { property: "og:description", content: "Professional small-business websites from ₹6,500, designed and developed by Hemasri." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: HomePage,
});

const projects = [[cafeImage, "Café storefront", "Menu, reservations and local discovery"], [gymImage, "Gym & fitness", "Class schedules and membership enquiries"], [boutiqueImage, "Boutique store", "Editorial products and WhatsApp shopping"]] as const;

function HomePage() {
  return <main>
    <header className="mx-auto max-w-5xl px-5 pb-12 pt-14 sm:pt-20">
      <p className="eyebrow hero-rise">Hemasri · independent web developer · India & worldwide</p>
      <h1 className="hero-rise mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.06] sm:text-6xl">Professional Websites for Growing Businesses</h1>
      <p className="hero-rise mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">Affordable, responsive and professional websites for small businesses.</p>
      <div className="hero-rise mt-6 inline-flex items-center gap-2.5 rounded-full border border-glass-border bg-glass px-4 py-2.5 backdrop-blur-xl"><span className="size-2 rounded-full bg-primary"/><span className="text-sm font-semibold">Websites starting from ₹6,500</span></div>
      <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="rounded-xl"><Link to="/request-website">Get a Free Website Demo</Link></Button>
        <Button asChild size="lg" variant="secondary" className="rounded-xl bg-glass"><Link to="/portfolio">View My Work</Link></Button>
        <WhatsAppButton size="lg" className="text-primary"/>
      </div>
    </header>

    <section className="mx-auto max-w-5xl px-5">
      <div className="overflow-hidden rounded-3xl border border-glass-border bg-glass shadow-glass backdrop-blur-xl">
        <div className="grid items-center gap-8 p-6 md:grid-cols-[1.1fr_1fr] md:p-8"><div><p className="eyebrow">Honest work, clearly priced</p><h2 className="mt-3 max-w-sm font-display text-3xl font-bold">Why choose First Step Future</h2><p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">I build the site, explain it plainly, and stay reachable after launch. No oversized agency, no jargon, no inflated quote.</p></div><img src={workspaceImage} width={1024} height={640} alt="A tablet showing a professionally designed small-business website" className="aspect-[16/10] w-full rounded-2xl object-cover" /></div>
        <ul className="grid border-t border-border/10 sm:grid-cols-2 lg:grid-cols-3">{benefits.map(([n, title, copy]) => <li key={title} className="border-border/10 bg-surface/55 p-5 sm:border-r sm:border-b"><span className="font-mono text-xs text-muted-foreground">{n}</span><h3 className="mt-1 font-display text-sm font-bold">{title}</h3><p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p></li>)}</ul>
      </div>
    </section>

    <section className="section-wrap"><SectionHeading label="Services" title="What I build"/><div className="mt-5 grid gap-4 md:grid-cols-3">{services.map(([title, copy, price], i) => <article className="glass-card" key={title}><p className="font-mono text-xs text-muted-foreground">({String.fromCharCode(97 + i)})</p><h3 className="mt-2 font-display font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p><p className="mt-4 font-mono text-xs text-primary">{price}</p></article>)}</div><Button asChild variant="link" className="mt-4 px-0"><Link to="/services">Explore all services →</Link></Button></section>

    <section className="section-wrap"><SectionHeading label="Portfolio" title="Featured projects" copy="RJ Coir is my first project — a live client website. The rest are sample concepts showing the type and quality of work available; they are not presented as client projects."/><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><article className="overflow-hidden rounded-2xl border border-primary/40 bg-glass ring-1 ring-primary/15"><img src={coirImage} width={912} height={736} loading="lazy" alt="RJ Coir website" className="aspect-[4/3] w-full object-cover"/><div className="p-4"><div className="flex items-center justify-between gap-2"><p className="font-display text-sm font-bold">RJ Coir</p><span className="rounded-full border border-primary/30 bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary">My first project</span></div><p className="mt-1 text-xs text-muted-foreground">Live client website for a cocopeat and coir exporter.</p><Button asChild variant="link" className="mt-2 px-0 text-sm"><a href="https://www.rjcoir.com/" target="_blank" rel="noreferrer">View website →</a></Button></div></article>{projects.map(([image, title, copy]) => <article className="overflow-hidden rounded-2xl border border-glass-border bg-glass" key={title}><img src={image} width={912} height={736} loading="lazy" alt={`${title} website sample concept`} className="aspect-[4/3] w-full object-cover"/><div className="p-4"><p className="font-display text-sm font-bold">{title}</p><p className="mt-1 text-xs text-muted-foreground">Sample concept · {copy}</p></div></article>)}</div></section>

    <section className="section-wrap"><div className="glass-card p-6 md:p-8"><SectionHeading label="Client Reviews" title="Real feedback only"/><div className="mt-5 rounded-xl border border-dashed border-border/20 bg-surface/40 p-7 text-center"><p className="font-display font-semibold">No approved reviews yet — and I won’t invent any.</p><p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Every review shown here will come from a genuine client project.</p><Button asChild variant="link" className="mt-2"><Link to="/reviews">Leave or view feedback →</Link></Button></div></div></section>

    <section className="section-wrap"><SectionHeading label="Simple process" title="How we’ll work"/><div className="mt-5 grid gap-4 md:grid-cols-3">{process.map(([step, title, copy]) => <article className="glass-card" key={step}><span className="font-mono text-xs text-primary">{step}</span><h3 className="mt-2 font-display font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p></article>)}</div></section>

    <section className="section-wrap"><div className="rounded-3xl border border-glass-border bg-primary-soft p-7 md:p-10"><h2 className="max-w-lg font-display text-3xl font-extrabold">Let’s get your business online.</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Tell me about your business and I’ll prepare a free website demo — no obligation and no jargon.</p><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg" className="rounded-xl"><Link to="/request-website">Get a Free Website Demo</Link></Button><WhatsAppButton size="lg" variant="secondary" className="bg-glass"/></div></div></section>
  </main>;
}