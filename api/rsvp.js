/* RSVP endpoint. Receives the form as JSON, emails the couple's inbox, then emails the guest a confirmation.
   Mail goes out over SMTP, configured with Vercel environment variables (see README):
     SMTP_HOST, SMTP_USER, SMTP_PASS   required
     SMTP_PORT                         default 465 (465 = TLS, anything else = STARTTLS)
     MAIL_FROM                         default "Modiri & Phemelo <info@tsst.co.za>"
     RSVP_TO                           default info@tsst.co.za                                   */
const nodemailer = require("nodemailer");

/* Fixed event details. Kept here, not taken from the request, so the endpoint can only ever send this wording. */
const EVENT = {
  couple: "Modiri & Phemelo",
  date: "Saturday, 14 November 2026",
  ceremony: "10:00",
  reception: "14:00",
  venue: "Suitability Gardens, Gauteng",
  dress: "All black",
  adults: "Adults only. Strictly no children, please.",
  replyBy: "31 October 2026"
};
const MAX_GUESTS = 2;
const DIETS = ["None", "Vegetarian", "Vegan", "Halaal", "No pork", "Allergy (see note)"];
const FROM = process.env.MAIL_FROM || "Modiri & Phemelo <info@tsst.co.za>";
const TO = process.env.RSVP_TO || "info@tsst.co.za";

/* Light per-instance rate limit. Not airtight on serverless, but stops a casual hammering. */
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 15 * 60 * 1000;
  const list = (hits.get(ip) || []).filter(t => now - t < win);
  list.push(now); hits.set(ip, list);
  if (hits.size > 500) for (const [k, v] of hits) if (!v.some(t => now - t < win)) hits.delete(k);
  return list.length > 8;
}

const oneLine = (v, max) => String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, max);
const multiLine = (v, max) => String(v == null ? "" : v).replace(/\r/g, "").replace(/[ \t]+/g, " ").trim().slice(0, max);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const EMAIL = /^[^\s@<>"',;:]+@[^\s@<>"',;:]+\.[^\s@<>"',;:]{2,}$/;

function parse(body) {
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (_) { body = {}; } }
  body = body || {};
  const g = {
    name: oneLine(body.name, 80),
    email: oneLine(body.email, 120).toLowerCase(),
    phone: oneLine(body.phone, 30),
    attending: body.attending === "yes" ? "yes" : body.attending === "no" ? "no" : "",
    guests: Math.min(MAX_GUESTS, Math.max(1, parseInt(body.guests, 10) || 1)),
    diet: DIETS.includes(body.diet) ? body.diet : "None",
    note: multiLine(body.note, 500)
  };
  if (!g.name) return { error: "Please add your full name." };
  if (!EMAIL.test(g.email)) return { error: "Please enter a valid email address." };
  if (!g.attending) return { error: "Please choose whether you will attend." };
  if (g.attending === "no") { g.guests = 0; g.diet = "None"; }
  return { g };
}

function hostMail(g) {
  const yes = g.attending === "yes";
  const lines = [
    "New RSVP for " + EVENT.couple,
    "",
    "Name: " + g.name,
    "Email: " + g.email,
    g.phone ? "Cell: " + g.phone : null,
    "Attending: " + (yes ? "Yes" : "No"),
    yes ? "Number attending: " + g.guests : null,
    yes && g.diet !== "None" ? "Dietary: " + g.diet : null,
    g.note ? "Note: " + g.note : null,
    "",
    "Reply to this email to answer the guest directly."
  ].filter(l => l !== null);
  return {
    from: FROM, to: TO, replyTo: g.email,
    subject: "RSVP: " + g.name + " · " + (yes ? "Yes (" + g.guests + ")" : "No"),
    text: lines.join("\n")
  };
}

function guestMail(g) {
  const yes = g.attending === "yes";
  const first = g.name.split(" ")[0];
  const rows = [
    ["Name", g.name],
    ["Attending", yes ? "Yes" : "No"],
    yes ? ["Number attending", String(g.guests)] : null,
    yes && g.diet !== "None" ? ["Dietary needs", g.diet] : null,
    g.phone ? ["Cell", g.phone] : null,
    g.note ? ["Your note", g.note] : null
  ].filter(Boolean);
  const intro = yes
    ? "Thank you for your RSVP. We have received it and your reservation is done. We cannot wait to celebrate with you."
    : "Thank you for letting us know. We have received your reply and we will miss you on the day.";
  const details = yes ? [
    ["Date", EVENT.date],
    ["Ceremony", EVENT.ceremony + " (please be seated by 09:45)"],
    ["Reception", EVENT.reception],
    ["Venue", EVENT.venue],
    ["Dress code", EVENT.dress],
    ["Please note", EVENT.adults]
  ] : [];
  const closing = "Need to change something? Just reply to this email and we will update your reservation.";

  const text = [
    "Dear " + first + ",", "", intro, "",
    "YOUR REPLY", ...rows.map(r => r[0] + ": " + r[1]),
    ...(details.length ? ["", "THE DAY", ...details.map(r => r[0] + ": " + r[1])] : []),
    "", closing, "", "With love,", EVENT.couple
  ].join("\n");

  const tr = r => '<tr><td style="padding:4px 14px 4px 0;color:#9a9a9a;font-size:13px;letter-spacing:.08em;text-transform:uppercase;vertical-align:top">' + esc(r[0]) + '</td><td style="padding:4px 0;color:#e6e6e6;font-size:16px">' + esc(r[1]) + "</td></tr>";
  const html = '<!doctype html><html><body style="margin:0;background:#020202">' +
    '<div style="max-width:520px;margin:0 auto;padding:36px 24px;background:#141414;color:#d8d8d8;font-family:Georgia,\'Times New Roman\',serif;line-height:1.55">' +
    '<p style="margin:0 0 6px;text-align:center;font-size:12px;letter-spacing:.3em;color:#b4b4b4">14 NOVEMBER 2026 · GAUTENG</p>' +
    '<h1 style="margin:0 0 22px;text-align:center;font-weight:normal;font-size:26px;letter-spacing:.14em;color:#f2f2f2">MODIRI &amp; PHEMELO</h1>' +
    '<p style="margin:0 0 14px;font-size:17px">Dear ' + esc(first) + ",</p>" +
    '<p style="margin:0 0 22px;font-size:17px">' + esc(intro) + "</p>" +
    '<p style="margin:0 0 6px;font-size:12px;letter-spacing:.24em;color:#b4b4b4">YOUR REPLY</p><table role="presentation" style="border-collapse:collapse;margin-bottom:22px">' + rows.map(tr).join("") + "</table>" +
    (details.length ? '<p style="margin:0 0 6px;font-size:12px;letter-spacing:.24em;color:#b4b4b4">THE DAY</p><table role="presentation" style="border-collapse:collapse;margin-bottom:22px">' + details.map(tr).join("") + "</table>" : "") +
    '<p style="margin:0 0 22px;font-size:16px;color:#b4b4b4;font-style:italic">' + esc(closing) + "</p>" +
    '<p style="margin:0;font-size:17px">With love,<br>' + esc(EVENT.couple) + "</p></div></body></html>";

  return {
    from: FROM, to: g.email, replyTo: TO,
    subject: "Your RSVP is confirmed · " + EVENT.couple,
    text, html
  };
}

let transport;
function getTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  if (!transport) {
    const port = parseInt(process.env.SMTP_PORT, 10) || 465;
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port, secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000
    });
  }
  return transport;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false, error: "Method not allowed." }); }

  /* Same-site requests only */
  const origin = req.headers.origin;
  if (origin) { try { if (new URL(origin).host !== req.headers.host) return res.status(403).json({ ok: false, error: "Not allowed." }); } catch (_) { return res.status(403).json({ ok: false, error: "Not allowed." }); } }

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "?").split(",")[0].trim();
  if (limited(ip)) return res.status(429).json({ ok: false, error: "Too many replies from this connection. Please try again in a few minutes." });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (_) { body = {}; } }
  if (body && body.website) return res.status(200).json({ ok: true, confirmation: false });   // honeypot: bots fill this, people never see it

  const { g, error } = parse(body);
  if (error) return res.status(400).json({ ok: false, error });

  const t = getTransport();
  if (!t) return res.status(503).json({ ok: false, error: "Online replies are not switched on yet." });

  try { await t.sendMail(hostMail(g)); }
  catch (e) { console.error("RSVP host mail failed:", e && e.message); return res.status(502).json({ ok: false, error: "We could not send your reply just now." }); }

  let confirmation = true;
  try { await t.sendMail(guestMail(g)); }
  catch (e) { confirmation = false; console.error("RSVP confirmation mail failed:", e && e.message); }

  return res.status(200).json({ ok: true, confirmation });
};
