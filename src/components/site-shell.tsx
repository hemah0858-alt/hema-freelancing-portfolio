import { WhatsAppButton, FloatingWhatsApp, whatsappLink } from "@/components/whatsapp-button";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

function useSignedIn() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.session));
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);
  return signedIn;
}

const links = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/portfolio", "Portfolio"],
  ["/reviews", "Client Reviews"],
  ["/contact", "Contact"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const signedIn = useSignedIn();

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
        <nav className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-glass-border bg-glass px-3 py-2.5 shadow-glass backdrop-blur-xl md:flex md:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary font-display text-sm font-extrabold text-primary-foreground">F</span>
            <span className="truncate font-display text-sm font-extrabold">First Step Future</span>
          </Link>
          <div className="hidden items-center gap-5 md:flex">
            {links.map(([to, label]) => (
              <Link key={to} to={to} className={pathname === to ? "nav-link-active" : "nav-link"}>{label}</Link>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {signedIn && (
              <Button asChild size="sm" variant="outline" className="hidden rounded-xl sm:inline-flex">
                <Link to="/admin"><LayoutDashboard className="size-4" />Dashboard</Link>
              </Button>
            )}
            {!signedIn && (
              <Button asChild size="sm" variant="ghost" className="hidden rounded-xl sm:inline-flex">
                <Link to="/auth">Sign in</Link>
              </Button>
            )}
            <Button asChild size="sm" className="hidden rounded-xl sm:inline-flex">
              <Link to="/request-website">Request a Website</Link>
            </Button>
            {signedIn && (
              <Button variant="ghost" size="icon" className="hidden rounded-xl md:inline-flex" aria-label="Sign out" onClick={() => void supabase.auth.signOut()}>
                <LogOut />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="rounded-xl md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
              {open ? <X /> : <Menu />}
            </Button>
          </div>
          {open && (
            <div className="col-span-2 grid gap-1 border-t border-border/30 pt-3 md:hidden">
              {links.map(([to, label]) => (
                <Link key={to} to={to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent">{label}</Link>
              ))}
              {signedIn && (
                <Link to="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-primary hover:bg-accent">Dashboard</Link>
              )}
              {!signedIn && (
                <Link to="/auth" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent">Sign in</Link>
              )}
              <Button asChild className="mt-2 rounded-xl sm:hidden"><Link to="/request-website">Request a Website</Link></Button>
              {signedIn && (
                <Button variant="outline" className="rounded-xl" onClick={() => { setOpen(false); void supabase.auth.signOut(); }}>Sign out</Button>
              )}
            </div>
          )}
        </nav>
      </header>
      {children}
      <footer className="mx-auto mt-20 max-w-5xl px-5 pb-32 sm:pb-10">
        <div className="flex flex-col gap-7 border-t border-border/10 pt-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm"><p className="font-display text-sm font-extrabold">First Step Future</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Independent website development by Hemasri. Made for small businesses in India and clients worldwide.</p></div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><Link to="/request-website">Request a Website</Link><Link to="/portfolio">Portfolio</Link><Link to="/contact">Contact</Link><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-primary">WhatsApp +91 72007 95959</a>{signedIn ? <Link to="/admin">Dashboard</Link> : <Link to="/auth">Sign in</Link>}</div>
        </div>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">© 2026 First Step Future · Websites from ₹6,500</p>
      </footer>
      <FloatingWhatsApp />
      <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 rounded-2xl border border-glass-border bg-glass p-2 shadow-glass backdrop-blur-xl sm:hidden">
        <WhatsAppButton>WhatsApp</WhatsAppButton>
        <Button asChild className="rounded-xl"><Link to="/request-website">Free Demo</Link></Button>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <header className="mx-auto max-w-5xl px-5 pb-10 pt-14"><p className="eyebrow">{eyebrow}</p><h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{copy}</p></header>;
}

export function SectionHeading({ label, title, copy }: { label: string; title: string; copy?: string }) {
  return <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><h2 className="font-display text-2xl font-bold">{title}</h2>{copy && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{copy}</p>}</div><span className="eyebrow hidden sm:block">{label}</span></div>;
}