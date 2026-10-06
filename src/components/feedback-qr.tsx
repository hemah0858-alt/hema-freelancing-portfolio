import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KNOWN_FEEDBACK_PROJECTS, slugify } from "@/lib/feedback-projects";

export function FeedbackQrSection() {
  const [origin, setOrigin] = useState("");
  const [project, setProject] = useState("");
  const [qr, setQr] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  const slug = slugify(project);
  const link = origin ? `${origin}/feedback${slug ? `?project=${slug}` : ""}` : "";

  useEffect(() => {
    if (!link) return;
    QRCode.toDataURL(link, { width: 640, margin: 2, errorCorrectionLevel: "M" }).then(setQr);
  }, [link]);

  async function copy() {
    await navigator.clipboard.writeText(link);
    toast.success("Feedback link copied");
  }
  function download() {
    const a = document.createElement("a");
    a.href = qr;
    a.download = `first-step-future-feedback${slug ? `-${slug}` : ""}-qr.png`;
    a.click();
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr]">
      <div className="glass-card text-center">
        <h2 className="font-display text-xl font-bold">Client Feedback QR</h2>
        {qr ? <img src={qr} alt="QR code to the feedback form" className="mx-auto mt-4 w-full max-w-64 rounded-xl bg-background" /> : <div className="mx-auto mt-4 aspect-square w-full max-w-64 animate-pulse rounded-xl bg-muted" />}
        <p className="mt-3 font-display text-lg font-bold">Scan to Leave Feedback</p>
        <p className="mt-1 break-all text-xs text-muted-foreground">{link}</p>
        <div className="mt-4 grid gap-2">
          <Button onClick={download} disabled={!qr} className="rounded-xl"><Download className="size-4" />Download QR</Button>
          <Button onClick={copy} disabled={!link} variant="outline" className="rounded-xl"><Copy className="size-4" />Copy Feedback Link</Button>
        </div>
      </div>
      <div className="glass-card">
        <h3 className="font-display text-lg font-bold">Project-specific link</h3>
        <p className="mt-1 text-sm text-muted-foreground">Add a project name and the QR code and link will fill it in on the client's feedback form. Leave it empty for the general link. Clients don't need an account.</p>
        <Label htmlFor="qr-project" className="mt-4 block">Project name</Label>
        <Input id="qr-project" value={project} onChange={(e) => setProject(e.target.value)} placeholder="e.g. RJ Coir" className="mt-2 rounded-xl" />
        <div className="mt-3 flex flex-wrap gap-2">
          {KNOWN_FEEDBACK_PROJECTS.map((p) => <Button key={p.slug} size="sm" variant="secondary" className="rounded-lg" onClick={() => setProject(p.name)}>{p.name}</Button>)}
          {project && <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => setProject("")}>Clear</Button>}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Tip: print the QR on your invoice or handover sheet, or send the link on WhatsApp after you finish a project.</p>
      </div>
    </div>
  );
}
