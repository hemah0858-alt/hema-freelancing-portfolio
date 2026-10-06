import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, Check, X, Trash2, Star, Plus, Pencil, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { FeedbackQrSection } from "@/components/feedback-qr";
import type { Tables } from "@/integrations/supabase/types";

type Feedback = Tables<"client_feedback">;
type Lead = Tables<"website_requests">;
type Project = Tables<"portfolio_projects">;

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — First Step Future" },
      { name: "description", content: "Manage leads, client feedback and portfolio for First Step Future." },
      { property: "og:title", content: "Admin Dashboard — First Step Future" },
      { property: "og:description", content: "Private admin area for First Step Future." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "follow_up", label: "Follow-up" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function AdminPage() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const load = useCallback(async () => {
    const [f, l, p] = await Promise.all([
      supabase.from("client_feedback").select("*").order("created_at", { ascending: false }),
      supabase.from("website_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("portfolio_projects").select("*").order("created_at", { ascending: false }),
    ]);
    setFeedback(f.data ?? []);
    setLeads(l.data ?? []);
    setProjects(p.data ?? []);
  }, []);

  useEffect(() => {
    void supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      setIsAdmin(!!data);
      if (data) void load();
    });
  }, [user.id, load]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isAdmin === null) return <main className="p-10 text-center text-muted-foreground">Loading…</main>;
  if (!isAdmin)
    return (
      <main className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You're signed in as {user.email}, but this account isn't an admin yet.
        </p>
        <Button className="mt-6" variant="outline" onClick={signOut}>Sign out</Button>
      </main>
    );

  const rated = feedback.filter((f) => f.status === "approved");
  const avg = rated.length ? (rated.reduce((s, f) => s + f.rating, 0) / rated.length).toFixed(1) : "—";
  const stats = [
    { label: "Total leads", value: leads.length },
    { label: "New leads", value: leads.filter((l) => l.status === "new").length },
    { label: "Total feedback", value: feedback.length },
    { label: "Pending feedback", value: feedback.filter((f) => f.status === "pending").length },
    { label: "Approved reviews", value: rated.length },
    { label: "Average rating", value: avg },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Toaster />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="mb-6 flex h-auto flex-wrap justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="qr">Feedback QR</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border bg-card/80 p-5 backdrop-blur">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-2 font-display text-3xl font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback"><FeedbackSection rows={feedback} reload={load} /></TabsContent>
        <TabsContent value="leads"><LeadsSection rows={leads} reload={load} /></TabsContent>
        <TabsContent value="portfolio"><PortfolioSection rows={projects} reload={load} /></TabsContent>
        <TabsContent value="qr"><FeedbackQrSection /></TabsContent>
        <TabsContent value="settings">
          <div className="max-w-lg rounded-2xl border bg-card/80 p-6">
            <dl className="space-y-3 text-sm">
              {[["Business", "First Step Future"], ["Founder", "Hemasri"], ["Service", "Website development"], ["Pricing", "Starting from ₹6,500"]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b pb-3 last:border-0"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-2xl border bg-card/80">{children}</div>;
}

function statusVariant(s: string): "default" | "secondary" | "destructive" | "outline" {
  return s === "approved" || s === "won" ? "default" : s === "rejected" || s === "lost" ? "destructive" : s === "pending" || s === "new" ? "secondary" : "outline";
}

function FeedbackSection({ rows, reload }: { rows: Feedback[]; reload: () => Promise<void> }) {
  const [view, setView] = useState<Feedback | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    setPhoto(null);
    if (view?.photo_url) {
      void supabase.storage.from("feedback-uploads").createSignedUrl(view.photo_url, 600).then(({ data }) => setPhoto(data?.signedUrl ?? null));
    }
  }, [view]);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("client_feedback").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Feedback ${status}`);
    void reload();
  }
  async function remove(id: string) {
    if (!confirm("Delete this feedback permanently?")) return;
    const { error } = await supabase.from("client_feedback").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    void reload();
  }

  return (
    <>
      <p className="mb-3 text-sm text-muted-foreground">Only approved feedback where the client allowed publishing appears on the public Reviews page.</p>
      <Wrap>
        <Table>
          <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Business</TableHead><TableHead>Rating</TableHead><TableHead>Project</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 && <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No feedback yet.</TableCell></TableRow>}
            {rows.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.client_name}</TableCell>
                <TableCell>{f.business_name}</TableCell>
                <TableCell><span className="inline-flex items-center gap-1">{f.rating}<Star className="h-3.5 w-3.5 fill-current text-primary" /></span></TableCell>
                <TableCell>{f.project_name ? <><span className="font-medium">{f.project_name}</span><br/><span className="text-xs text-muted-foreground">{f.project_type}</span></> : f.project_type}</TableCell>
                <TableCell><Badge variant={statusVariant(f.status)} className="capitalize">{f.status}</Badge>{!f.permission_to_publish && <span className="ml-1 text-xs text-muted-foreground">private</span>}</TableCell>
                <TableCell className="whitespace-nowrap">{fmtDate(f.created_at)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" title="View" onClick={() => setView(f)}><Eye className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" title="Approve" onClick={() => setStatus(f.id, "approved")}><Check className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" title="Reject" onClick={() => setStatus(f.id, "rejected")}><X className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" title="Delete" onClick={() => remove(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Wrap>
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          {view && (
            <>
              <DialogHeader><DialogTitle>{view.client_name} — {view.business_name}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                {photo && <img src={photo} alt={view.client_name} className="h-20 w-20 rounded-full object-cover" />}
                <p><strong>Rating:</strong> {view.rating}/5 · <strong>Project:</strong> {view.project_name ? `${view.project_name} (${view.project_type})` : view.project_type}</p>
                {view.email && <p><strong>Email:</strong> {view.email}</p>}
                <p><strong>What they liked:</strong><br />{view.positive_feedback}</p>
                {view.improvement_feedback && <p><strong>Could improve:</strong><br />{view.improvement_feedback}</p>}
                <p><strong>Would recommend:</strong> {view.would_recommend ? "Yes" : "No"} · <strong>Can publish:</strong> {view.permission_to_publish ? "Yes" : "No"}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function LeadsSection({ rows, reload }: { rows: Lead[]; reload: () => Promise<void> }) {
  async function update(id: string, patch: Partial<Lead>) {
    const { error } = await supabase.from("website_requests").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Lead updated");
    void reload();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("website_requests").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Lead deleted");
    void reload();
  }
  return (
    <Wrap>
      <Table>
        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Business</TableHead><TableHead>Phone / WhatsApp</TableHead><TableHead>Email</TableHead><TableHead>Category</TableHead><TableHead>Website status</TableHead><TableHead>Requirements</TableHead><TableHead>Budget</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {rows.length === 0 && <TableRow><TableCell colSpan={11} className="py-10 text-center text-muted-foreground">No leads yet.</TableCell></TableRow>}
          {rows.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="font-medium">{l.name}</TableCell>
              <TableCell>{l.business_name}</TableCell>
              <TableCell className="whitespace-nowrap"><a className="text-primary hover:underline" href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{l.phone}</a></TableCell>
              <TableCell>{l.email ?? "—"}</TableCell>
              <TableCell>{l.business_type}</TableCell>
              <TableCell>
                <Select value={l.website_status ?? ""} onValueChange={(v) => update(l.id, { website_status: v })}>
                  <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Set…" /></SelectTrigger>
                  <SelectContent>
                    {["No website", "Has website", "Needs redesign"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="text-xs font-medium">{[l.website_type, l.pages_required && `${l.pages_required} pages`, l.city, l.current_website && `Has site: ${l.current_website}`].filter(Boolean).join(" · ")}</p>
                <p className="line-clamp-3 text-xs">{l.project_details}</p>
                {l.lead_source && <p className="text-xs text-muted-foreground">Found via: {l.lead_source}</p>}
              </TableCell>
              <TableCell>{l.budget ?? "—"}</TableCell>
              <TableCell className="whitespace-nowrap">{fmtDate(l.created_at)}</TableCell>
              <TableCell>
                <Select value={l.status} onValueChange={(v) => update(l.id, { status: v })}>
                  <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>{LEAD_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button size="icon" variant="ghost" title="Delete" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Wrap>
  );
}

const emptyProject = { name: "", category: "", description: "", website_url: "", is_featured: false };

function PortfolioSection({ rows, reload }: { rows: Project[]; reload: () => Promise<void> }) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyProject);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function start(p: Project | null) {
    setEditing(p);
    setForm(p ? { name: p.name, category: p.category, description: p.description, website_url: p.website_url ?? "", is_featured: p.is_featured } : emptyProject);
    setFile(null);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    let image_path = editing?.image_path ?? null;
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("portfolio-images").upload(path, file, { contentType: file.type });
      if (error) { setSaving(false); toast.error(error.message); return; }
      image_path = path;
    }
    const payload = { ...form, website_url: form.website_url.trim() || null, image_path };
    const { error } = editing
      ? await supabase.from("portfolio_projects").update(payload).eq("id", editing.id)
      : await supabase.from("portfolio_projects").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Project saved");
    setOpen(false);
    void reload();
  }

  async function remove(p: Project) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const { error } = await supabase.from("portfolio_projects").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    if (p.image_path) await supabase.storage.from("portfolio-images").remove([p.image_path]);
    toast.success("Deleted");
    void reload();
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Projects added here appear on the public Portfolio page.</p>
        <Button size="sm" onClick={() => start(null)}><Plus className="mr-1 h-4 w-4" />Add project</Button>
      </div>
      <Wrap>
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Website</TableHead><TableHead>Featured</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No projects added yet.</TableCell></TableRow>}
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.website_url ? <a href={p.website_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">Open</a> : "—"}</TableCell>
                <TableCell>{p.is_featured ? <Badge>Featured</Badge> : "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => start(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(p)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Wrap>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit project" : "Add project"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1.5"><Label>Name</Label><Input required maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Category</Label><Input required maxLength={60} placeholder="Business, Restaurant, Fitness…" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea maxLength={600} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Website URL</Label><Input type="url" placeholder="https://" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Project image</Label><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
            <label className="flex items-center gap-3 text-sm"><Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />Mark as featured</label>
            <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : "Save project"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
