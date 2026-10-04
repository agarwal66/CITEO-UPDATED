"use client";
import { useEffect, useState } from "react";

const STATUSES = ["new", "contacted", "qualified", "won", "lost"];

export default function Admin() {
  const [key, setKey] = useState("");
  const [leads, setLeads] = useState(null);
  const [filter, setFilter] = useState("all");
  const [err, setErr] = useState("");

  async function load(k) {
    setErr("");
    const res = await fetch("/api/admin/leads", { headers: { "x-admin-key": k } });
    if (!res.ok) { setLeads(null); sessionStorage.removeItem("ak"); setErr(res.status === 401 ? "Wrong password." : "Could not load leads."); return; }
    sessionStorage.setItem("ak", k);
    setLeads((await res.json()).leads);
  }

  useEffect(() => { const k = sessionStorage.getItem("ak"); if (k) { setKey(k); load(k); } }, []);

  async function setStatus(id, status) {
    setLeads((ls) => ls.map((l) => (l._id === id ? { ...l, status } : l)));
    await fetch("/api/admin/leads", { method: "PATCH", headers: { "x-admin-key": key, "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
  }

  function exportCsv() {
    const cols = ["createdAt", "name", "email", "company", "type", "budget", "timeline", "status", "source", "message"];
    const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = leads.map((l) => cols.map((c) => q(c === "source" ? l.attribution?.utm_source || l.source : l[c])).join(","));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([[cols.join(","), ...rows].join("\n")], { type: "text/csv" }));
    a.download = "citeo-leads.csv";
    a.click();
  }

  if (!leads) {
    return (
      <section className="wrap section narrow">
        <h1>Leads</h1>
        <form className="form" onSubmit={(e) => { e.preventDefault(); load(key); }}>
          <label>Admin password<input type="password" value={key} onChange={(e) => setKey(e.target.value)} required /></label>
          {err && <p className="error">{err}</p>}
          <button className="btn">Open dashboard</button>
        </form>
      </section>
    );
  }

  const shown = filter === "all" ? leads : leads.filter((l) => (l.status || "new") === filter);
  return (
    <section className="wrap section">
      <h1>Leads <span className="muted">({leads.length})</span></h1>
      <div className="row tabs">
        {["all", ...STATUSES].map((s) => (
          <button key={s} className={`btn btn-sm ${filter === s ? "" : "btn-ghost"}`} onClick={() => setFilter(s)}>
            {s} ({s === "all" ? leads.length : leads.filter((l) => (l.status || "new") === s).length})
          </button>
        ))}
        <button className="btn btn-sm btn-ghost" onClick={exportCsv}>Export CSV</button>
        <button className="btn btn-sm btn-ghost" onClick={() => load(key)}>Refresh</button>
      </div>
      <div className="table-wrap">
        <table className="leads">
          <thead><tr><th>Date</th><th>Lead</th><th>Project</th><th>Budget</th><th>Source</th><th>Status</th></tr></thead>
          <tbody>
            {shown.map((l) => (
              <tr key={l._id}>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
                <td>
                  <b>{l.name}</b><br /><a href={`mailto:${l.email}`}>{l.email}</a>{l.company && <><br />{l.company}</>}
                  <details><summary>Message</summary><p>{l.message}</p></details>
                </td>
                <td>{l.type}<br /><span className="muted">{l.timeline}</span></td>
                <td>{l.budget}</td>
                <td>{l.attribution?.utm_source || l.source}<br /><span className="muted">{l.attribution?.utm_campaign}</span></td>
                <td>
                  <select value={l.status || "new"} onChange={(e) => setStatus(l._id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
