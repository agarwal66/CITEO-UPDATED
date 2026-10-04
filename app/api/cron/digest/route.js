import { NextResponse } from "next/server";
import { getLeads } from "@/lib/mongodb";
import { sendAlert } from "@/lib/notify";

export const runtime = "nodejs";

// Roz subah summary: pichhle 24 ghante mein kitni leads aayi
export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const col = await getLeads();
    const since = new Date(Date.now() - 24 * 3600 * 1000);
    const recent = await col.find({ createdAt: { $gte: since } }).toArray();
    const pending = await col.countDocuments({ status: "new" });
    const bySource = {};
    recent.forEach((l) => { const s = l.attribution?.utm_source || l.source || "direct"; bySource[s] = (bySource[s] || 0) + 1; });
    const lines = Object.entries(bySource).map(([k, v]) => `${k}: ${v}`).join(", ") || "none";
    const text = `New leads in last 24h: ${recent.length}\nBy source: ${lines}\nStill marked "new" (not contacted): ${pending}`;
    await sendAlert({ subject: `Citeo daily summary: ${recent.length} new leads`, html: `<pre style="font-size:15px">${text}</pre>`, text });
    return NextResponse.json({ ok: true, count: recent.length });
  } catch (e) {
    return NextResponse.json({ error: "Digest failed" }, { status: 500 });
  }
}
