import nodemailer from "nodemailer";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function mailer() {
  const { SMTP_USER, SMTP_PASS, SMTP_HOST } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({ host: SMTP_HOST || "smtp.gmail.com", port: 465, secure: true, auth: { user: SMTP_USER, pass: SMTP_PASS } });
}

// Owner ko email + (optional) Telegram message
export async function sendAlert({ subject, html, text, replyTo }) {
  const jobs = [];
  const m = mailer();
  const to = process.env.NOTIFY_EMAIL;
  if (m && to) jobs.push(m.sendMail({ from: `Citeo Alerts <${process.env.SMTP_USER}>`, to, subject, html, text, replyTo }));
  const { TELEGRAM_BOT_TOKEN: t, TELEGRAM_CHAT_ID: c } = process.env;
  if (t && c) {
    jobs.push(fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: c, text: `${subject}\n\n${text}` }),
    }));
  }
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === "rejected" && console.error("Alert failed:", r.reason));
}

// Nayi lead aane par: owner alert + client ko auto-reply
export async function notifyNewLead(lead) {
  const a = lead.attribution || {};
  const from = a.utm_source || lead.source || "direct";
  const text = [
    `Name: ${lead.name}`, `Email: ${lead.email}`, `Company: ${lead.company || "-"}`,
    `Project: ${lead.type}`, `Budget: ${lead.budget}`, `Timeline: ${lead.timeline}`,
    `Source: ${from}${a.utm_campaign ? " / " + a.utm_campaign : ""}`, "", lead.message,
  ].join("\n");
  const rows = [["Name", lead.name], ["Email", lead.email], ["Company", lead.company || "-"], ["Project", lead.type], ["Budget", lead.budget], ["Timeline", lead.timeline], ["Source", from + (a.utm_campaign ? " / " + a.utm_campaign : "")]]
    .map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#667"><b>${k}</b></td><td>${esc(v)}</td></tr>`).join("");
  const html = `<table style="font-family:Arial,sans-serif;font-size:15px">${rows}</table><p style="font-family:Arial,sans-serif;white-space:pre-wrap">${esc(lead.message)}</p>`;

  await sendAlert({ subject: `New lead: ${lead.type} | ${lead.budget} | ${lead.name}`, html, text, replyTo: lead.email });

  const m = mailer();
  if (m && process.env.AUTO_REPLY !== "off") {
    try {
      await m.sendMail({
        from: `Citeo <${process.env.SMTP_USER}>`, to: lead.email, subject: "We received your project inquiry",
        text: `Hi ${lead.name},\n\nThanks for reaching out to Citeo. We've received your inquiry and will reply within one business day.\n\nIn the meantime, feel free to reply to this email with any extra details.\n\nBest regards,\nCiteo`,
      });
    } catch (e) { console.error("Auto-reply failed:", e); }
  }
}
