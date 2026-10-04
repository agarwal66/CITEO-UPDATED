import { NextResponse } from "next/server";
import { getLeads } from "@/lib/mongodb";
import { notifyNewLead } from "@/lib/notify";

export const runtime = "nodejs";

const clean = (v, max) => String(v ?? "").trim().slice(0, max);
const hits = new Map(); // simple rate limit: 5 inquiries / 10 min / IP

// Browser mein /api/contact kholo: database connect ho raha hai ya nahi, yahin pata chalega
export async function GET() {
  try {
    await (await getLeads()).estimatedDocumentCount();
    return NextResponse.json({ ok: true, database: "connected" });
  } catch (err) {
    return NextResponse.json({ ok: false, database: "failed", reason: explain(err) }, { status: 500 });
  }
}

function explain(err) {
  const m = String(err?.message || err);
  if (m.includes("MONGODB_URI")) return m;
  if (/auth|bad auth/i.test(m)) return "Wrong username or password in MONGODB_URI.";
  if (/ENOTFOUND|querySrv|ECONNREFUSED/i.test(m)) return "Cannot reach Atlas. Check the cluster host in MONGODB_URI and your internet.";
  if (/ServerSelection|timed out|whitelist|IP/i.test(m)) return "Atlas blocked the connection. Add your IP in Atlas > Network Access (use 0.0.0.0/0 for Vercel).";
  return m;
}

export async function POST(req) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < 600000);
    if (recent.length >= 5) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    hits.set(ip, [...recent, now]);

    const body = await req.json();
    if (body.website) return NextResponse.json({ ok: true }); // honeypot

    const a = body.attribution || {};
    const lead = {
      name: clean(body.name, 100),
      email: clean(body.email, 150).toLowerCase(),
      company: clean(body.company, 150),
      type: clean(body.type, 50),
      budget: clean(body.budget, 50),
      timeline: clean(body.timeline, 50),
      message: clean(body.message, 3000),
      source: clean(body.source, 30),
      attribution: Object.fromEntries(
        ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "referrer", "landing"].map((k) => [k, clean(a[k], 300)])
      ),
      status: "new",
      createdAt: new Date(),
    };

    if (!lead.name || !lead.type || !lead.budget || !lead.timeline)
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (lead.message.length < 20)
      return NextResponse.json({ error: "Please describe your project in at least 20 characters." }, { status: 400 });

    await (await getLeads()).insertOne(lead); // pehle DB mein save
    await notifyNewLead(lead).catch((e) => console.error("Notify error:", e)); // email fail ho toh bhi lead safe hai
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    // dev mein asli wajah dikhao, production mein simple message
    const msg = process.env.NODE_ENV === "development" ? explain(err) : "Could not send your inquiry. Please try again or email us directly.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
