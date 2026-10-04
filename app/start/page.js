import ContactForm from "@/components/ContactForm";
import { faq } from "@/data/site";

// Ads ka landing page: Meta/Google ads ka link yahan point karo (/start?utm_source=...)
export const metadata = {
  title: "Get a free project estimate | Citeo",
  description: "Tell us what you want to build. Get a clear scope and estimate from a full-stack team within one business day.",
  robots: { index: false },
};

export default function Start() {
  return (
    <>
      <section className="hero">
        <div className="wrap lp">
          <div>
            <p className="pill">Free project estimate</p>
            <h1>Get your SaaS, MVP or web app built by a full-stack team.</h1>
            <p className="lead">Tell us what you want to build. You get a clear scope, timeline and estimate, with no obligation.</p>
            <ul className="checks">
              <li>Reply within one business day</li>
              <li>Fixed-scope proposals with milestones</li>
              <li>Regular demos and clear communication</li>
              <li>NDA on request</li>
            </ul>
          </div>
          <div className="card-form"><h2>Tell us about your project</h2><ContactForm source="start" /></div>
        </div>
      </section>

      <section className="wrap section">
        <h2>What happens after you send the form.</h2>
        <ol className="steps">
          <li><span className="num">1</span><div><h3>We review</h3><p>We read your inquiry and note questions about goals, users and scope.</p></div></li>
          <li><span className="num">2</span><div><h3>Short call</h3><p>A 30-minute call to understand requirements and discuss the technical approach.</p></div></li>
          <li><span className="num">3</span><div><h3>Clear proposal</h3><p>Scope, milestones, timeline and cost, so you can decide with full information.</p></div></li>
        </ol>
      </section>

      <section className="wrap section narrow">
        <h2>Common questions</h2>
        {faq.slice(0, 5).map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </section>
    </>
  );
}
