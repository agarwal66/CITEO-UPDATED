import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getLeads } from "@/lib/mongodb";

export const runtime = "nodejs";
const STATUSES = ["new", "contacted", "qualified", "won", "lost"];

function authed(req) {
  const pass = process.env.ADMIN_PASSWORD;
  return Boolean(pass) && req.headers.get("x-admin-key") === pass;
}

export async function GET(req) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const col = await getLeads();
    const leads = await col.find({}).sort({ createdAt: -1 }).limit(1000).toArray();
    return NextResponse.json({ leads: leads.map((l) => ({ ...l, _id: String(l._id) })) });
  } catch (e) {
    return NextResponse.json({ error: "Could not load leads." }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, status } = await req.json();
    if (!STATUSES.includes(status) || !ObjectId.isValid(id)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
    const col = await getLeads();
    await col.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Could not update." }, { status: 500 });
  }
}
