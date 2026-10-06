export const KNOWN_FEEDBACK_PROJECTS: { slug: string; name: string }[] = [
  { slug: "rj-coir", name: "RJ Coir" },
];

export const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export function projectNameFromSlug(slug: string) {
  const clean = slugify(slug);
  const known = KNOWN_FEEDBACK_PROJECTS.find((p) => p.slug === clean);
  if (known) return known.name;
  return clean.split("-").filter(Boolean).map((w) => w[0]!.toUpperCase() + w.slice(1)).join(" ");
}
