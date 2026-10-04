import { services } from "@/data/site";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pages = ["", "/contact", "/book", "/privacy", "/terms", ...services.map((s) => `/services/${s.slug}`)];
  return pages.map((p) => ({ url: base + p, lastModified: new Date() }));
}
