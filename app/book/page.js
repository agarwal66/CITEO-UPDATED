import Link from "next/link";
import CtaLink from "@/components/CtaLink";

export const metadata = { title: "Book a consultation | Citeo" };

// .env.local mein NEXT_PUBLIC_CALENDLY_URL daalo (Calendly / Cal.com link)
const CAL = process.env.NEXT_PUBLIC_CALENDLY_URL;

export default function Book() {
  return (
    <section className="wrap section narrow">
      <h1>Let's talk about your project.</h1>
      <p className="lead">A 30-minute call to understand your requirements, discuss the technical approach, estimate scope and decide next steps.</p>
      {CAL ? (
        <CtaLink href={CAL} event="book_click" label="book_page" target="_blank" rel="noopener" className="btn btn-lg">Pick a time</CtaLink>
      ) : (
        <p>Online scheduling is not set up yet. <Link href="/contact" className="more">Send a project inquiry</Link> and we'll reply with times.</p>
      )}
    </section>
  );
}
