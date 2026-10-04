import Link from "next/link";
import CtaLink from "@/components/CtaLink";

export const metadata = { title: "Thank you | Citeo", robots: { index: false } };

export default function ThankYou() {
  return (
    <section className="wrap section narrow">
      <h1>Thanks, we got your inquiry.</h1>
      <p className="lead">We'll review it and reply to your email within one business day. Want to move faster? Pick a time for a 30-minute call.</p>
      <div className="row">
        <CtaLink href="/book" event="book_click" label="thankyou_book" className="btn btn-lg">Book a consultation</CtaLink>
        <Link href="/" className="btn btn-lg btn-ghost">Back to home</Link>
      </div>
    </section>
  );
}
