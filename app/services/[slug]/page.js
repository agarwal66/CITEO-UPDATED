import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return s ? { title: `${s.title} | Citeo`, description: s.text } : {};
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  return (
    <section className="wrap section narrow">
      <h1>{s.title}</h1>
      <p className="lead">{s.text}</p>
      <p>{s.long}</p>
      <Link href="/contact" className="btn">Discuss your project</Link>
    </section>
  );
}
