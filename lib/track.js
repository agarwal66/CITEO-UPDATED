// Ads tracking helper: GA4 + Meta Pixel dono ko ek hi jagah se event bhejta hai.
// IDs na ho toh ye kuch nahi karta (safe).
const META = {
  generate_lead: ["track", "Lead"],
  book_click: ["track", "Schedule"],
  cta_click: ["trackCustom", "CtaClick"],
  form_start: ["trackCustom", "FormStart"],
};

export function track(name, params = {}) {
  if (typeof window === "undefined") return;
  try {
    if (window.gtag) window.gtag("event", name, params);
    if (window.fbq && META[name]) window.fbq(META[name][0], META[name][1], params);
  } catch (e) {}
}

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];

export function saveAttribution() {
  try {
    const q = new URLSearchParams(window.location.search);
    const found = {};
    KEYS.forEach((k) => q.get(k) && (found[k] = q.get(k)));
    if (Object.keys(found).length || !sessionStorage.getItem("attr")) {
      sessionStorage.setItem("attr", JSON.stringify({ ...found, referrer: document.referrer, landing: window.location.pathname }));
    }
  } catch (e) {}
}

export function getAttribution() {
  try { return JSON.parse(sessionStorage.getItem("attr") || "{}"); } catch (e) { return {}; }
}
