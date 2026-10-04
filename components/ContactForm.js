"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { track, getAttribution } from "@/lib/track";

const types = ["SaaS", "MVP", "Web Application", "AI Application", "Dashboard", "Business Website", "API/Backend", "Other"];
const budgets = ["Under $1,000", "$1,000–$3,000", "$3,000–$5,000", "$5,000–$10,000", "$10,000+"];
const timelines = ["ASAP", "1–2 months", "3–6 months", "Just exploring"];

function Select({ name, label, options }) {
  return (
    <label>{label}
      <select name={name} required defaultValue="">
        <option value="" disabled>Select one</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

export default function ContactForm({ source = "contact" }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const started = useRef(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (sending) return; // double submit roko
    setError("");
    setSending(true);
    const data = Object.fromEntries(new FormData(e.target));
    data.source = source;
    data.attribution = getAttribution();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      track("generate_lead", { source, project_type: data.type, budget: data.budget });
      router.push("/thank-you");
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  }

  return (
    <form
      id="inquiry"
      className="form"
      onSubmit={onSubmit}
      onFocus={() => { if (!started.current) { started.current = true; track("form_start", { source }); } }}
    >
      <div className="two">
        <label>Name<input name="name" required maxLength={100} autoComplete="name" /></label>
        <label>Business email<input name="email" type="email" required maxLength={150} autoComplete="email" /></label>
      </div>
      <label>Company <span className="opt">(optional)</span><input name="company" maxLength={150} autoComplete="organization" /></label>
      <Select name="type" label="What do you want to build?" options={types} />
      <div className="two">
        <Select name="budget" label="Budget" options={budgets} />
        <Select name="timeline" label="Timeline" options={timelines} />
      </div>
      <label>Tell us about your project
        <textarea name="message" rows={4} required minLength={20} maxLength={3000} placeholder="What problem are you solving, and who is it for?" />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn btn-lg" disabled={sending}>{sending ? "Sending..." : "Send project inquiry"}</button>
      <p className="fine">We reply within one business day. NDA available on request.</p>
    </form>
  );
}
