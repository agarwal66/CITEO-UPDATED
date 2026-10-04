import Link from "next/link";
import CtaLink from "@/components/CtaLink";
import { services, steps, work, faq } from "@/data/site";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="pill">Full-stack development agency</p>
            <h1>We build digital products that move businesses forward.</h1>
            <p className="lead">Citeo helps startups and businesses turn ideas into high-performance web applications, SaaS products and AI-powered solutions.</p>
            <div className="row">
              <CtaLink href="/start" label="hero_start" className="btn btn-lg">Start a project</CtaLink>
              <Link href="/#work" className="btn btn-lg btn-outline">View our work</Link>
            </div>
            <p className="fine">Working with teams in the US, UK, Australia and Canada.</p>
          </div>
          <div className="mock" aria-hidden="true">
            <div className="mock-bar"><i /><i /><i /><span>app.yourproduct.com</span></div>
            <div className="mock-body">
              <div className="stats">
                <div><small>Active users</small><b>2,481</b></div>
                <div><small>Uptime</small><b>99.98%</b></div>
                <div><small>API latency</small><b>84ms</b></div>
              </div>
              <div className="bars">{[40, 62, 48, 75, 58, 88, 70, 95].map((h, i) => <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }} />)}</div>
              <div className="log">
                {["Design approved", "API deployed", "Frontend deployed", "Live in production"].map((s, i) => (
                  <div key={s} style={{ animationDelay: `${0.6 + i * 0.45}s` }}><span className="tick" />{s}</div>
                ))}
              </div>
            </div>
            <p className="mock-note">Illustrative interface, not a client result.</p>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap tech">
          <span>Built with</span>
          {["Next.js", "React", "Node.js", "MongoDB", "PostgreSQL", "Docker", "Vercel"].map((t) => <b key={t}>{t}</b>)}
        </div>
      </section>

      <section className="wrap section">
        <h2>Your idea deserves more than just code.</h2>
        <div className="grid3">
          <div className="box"><h3>Have an idea?</h3><p>Turn your concept into a functional MVP.</p></div>
          <div className="box"><h3>Have an existing product?</h3><p>Improve performance, UX, reliability and scalability.</p></div>
          <div className="box"><h3>Need a technical team?</h3><p>Work with a dedicated development partner without building an internal team.</p></div>
        </div>
      </section>

      <section id="services" className="wrap section">
        <h2>Everything you need to build and scale your product.</h2>
        <div className="grid3">
          {services.map((s) => (
            <Link href={`/services/${s.slug}`} className="box link-box" key={s.slug}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <span className="more">Explore service</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="work" className="wrap section">
        <h2>Built for real-world problems.</h2>
        <div className="grid3">
          {work.map((w) => (
            <article className="box" key={w.name}>
              <span className="chip">{w.tag}</span>
              <h3>{w.name}</h3>
              <p>{w.text}</p>
              <p className="small">{w.stack}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="wrap section">
        <h2>A simple process. No unnecessary complexity.</h2>
        <ol className="steps">
          {steps.map(([t, d], i) => (
            <li key={t}><span className="num">{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="wrap section">
        <h2>Work with us your way.</h2>
        <div className="grid3">
          <div className="box"><h3>Fixed project</h3><p>For clearly defined websites, MVPs and applications.</p></div>
          <div className="box"><h3>Dedicated development</h3><p>For businesses that need ongoing engineering capacity.</p></div>
          <div className="box"><h3>Monthly partnership</h3><p>For long-term product development and maintenance.</p></div>
        </div>
      </section>

      <section className="wrap section narrow">
        <h2>Questions we get often</h2>
        {faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </section>

      <section className="cta">
        <div className="wrap">
          <h2>Have an idea worth building?</h2>
          <p className="lead">Tell us what you're working on. We'll help you figure out the best way to build it.</p>
          <div className="row">
            <CtaLink href="/start" label="footer_start" className="btn btn-lg">Start a conversation</CtaLink>
            <CtaLink href="/book" event="book_click" label="footer_book" className="btn btn-lg btn-outline">Book a free consultation</CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
