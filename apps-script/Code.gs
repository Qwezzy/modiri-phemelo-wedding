/* Modiri & Phemelo RSVP collector (Google Apps Script).
   The site's /api/rsvp function posts each reply here. This script:
     1. adds the reply to the "RSVPs" sheet (one row per guest email; a repeat reply updates that row)
     2. emails the guest a confirmation
     3. emails the owner a daily digest of new replies (only on days there are some)
   Setup: see README.md ("RSVP to a Google Sheet"). Run setup() once, then deploy as a web app. */

const SECRET = "PASTE_SECRET_HERE";   // must match APPS_SCRIPT_SECRET in Vercel
const REPLY_TO = "";                  // where guests' replies to the confirmation go. Blank = the owner of this script
const DIGEST_TO = "";                 // who gets the daily digest. Blank = the owner of this script
const SENDER_NAME = "Modiri & Phemelo";
const RSVP_CONTACT = "Kago Gabaatlhole";   // named in the confirmation as the person to contact

const EVENT = {
  couple: "Modiri & Phemelo",
  date: "Saturday, 14 November 2026",
  ceremony: "10:00 (please be seated by 09:45)",
  reception: "14:00",
  venue: "Suitability Gardens, Gauteng",
  dress: "All black",
  adults: "Adults only. Strictly no children, please."
};
const MAX_GUESTS = 2;
const DIETS = ["None", "Vegetarian", "Vegan", "Halaal", "No pork", "Allergy (see note)"];
const TAB = "RSVPs";
const HEAD = ["Received", "Updated", "Name", "Email", "Cell", "Attending", "Number attending", "Dietary", "Note", "Replies"];
const C = { RECEIVED: 1, UPDATED: 2, NAME: 3, EMAIL: 4, CELL: 5, ATT: 6, NUM: 7, DIET: 8, NOTE: 9, REPLIES: 10 };

/* ---------- one-off setup: creates the sheet, the Summary tab and the daily digest ---------- */
function setup() {
  const props = PropertiesService.getScriptProperties();
  let ss;
  const id = props.getProperty("SHEET_ID");
  if (id) ss = SpreadsheetApp.openById(id);
  else { ss = SpreadsheetApp.create("Modiri & Phemelo RSVPs"); props.setProperty("SHEET_ID", ss.getId()); }

  let sh = ss.getSheetByName(TAB);
  if (!sh) { sh = ss.getSheets()[0]; sh.setName(TAB); }
  sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight("bold").setBackground("#111111").setFontColor("#ffffff");
  sh.setFrozenRows(1);
  sh.getRange("A:B").setNumberFormat("yyyy-mm-dd hh:mm");
  [150, 150, 170, 220, 120, 90, 90, 130, 300, 70].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.getRange("I:I").setWrap(true);

  let sum = ss.getSheetByName("Summary");
  if (!sum) sum = ss.insertSheet("Summary", 0);
  sum.clear();
  const R = TAB + "!";
  const rows = [
    ["Modiri & Phemelo RSVP summary", ""],
    ["", ""],
    ["Replies received", "=COUNTA(" + R + "D2:D)"],
    ["Replies: attending", '=COUNTIF(' + R + 'F2:F,"Yes")'],
    ["Replies: declined", '=COUNTIF(' + R + 'F2:F,"No")'],
    ["Total headcount attending", '=SUMIF(' + R + 'F2:F,"Yes",' + R + 'G2:G)'],
    ["Last reply", "=IF(COUNT(" + R + "A2:A)=0,\"none yet\",MAX(" + R + "A2:A))"],
    ["", ""],
    ["Dietary needs (attending replies)", ""]
  ];
  DIETS.filter(d => d !== "None").forEach(d => rows.push([d, '=COUNTIFS(' + R + 'F2:F,"Yes",' + R + 'H2:H,"' + d + '")']));
  sum.getRange(1, 1, rows.length, 2).setFormulas(rows);
  sum.getRange("A1").setFontSize(14).setFontWeight("bold");
  sum.getRange("A9").setFontWeight("bold");
  sum.getRange("B7").setNumberFormat("yyyy-mm-dd hh:mm");
  sum.getRange("B:B").setHorizontalAlignment("left");
  sum.setColumnWidth(1, 260); sum.setColumnWidth(2, 150);

  installDigest();
  Logger.log("Sheet ready: " + ss.getUrl());
}

function installDigest() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === "sendDigest").forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("sendDigest").timeBased().everyDays(1).atHour(7).create();
}

/* ---------- web app entry point ---------- */
function doPost(e) {
  let out;
  try {
    const d = JSON.parse(e.postData.contents);
    if (!SECRET || SECRET === "PASTE_SECRET_HERE" || d.secret !== SECRET) out = { ok: false, error: "unauthorised" };
    else out = save(clean(d));
  } catch (err) { out = { ok: false, error: String(err && err.message || err) }; }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
function doGet() { return ContentService.createTextOutput("RSVP collector is running."); }

const one = (v, max) => String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, max);
function clean(d) {
  const attending = d.attending === "yes" ? "yes" : d.attending === "no" ? "no" : "";
  const g = {
    name: one(d.name, 80), email: one(d.email, 120).toLowerCase(), phone: one(d.phone, 30), attending,
    guests: Math.min(MAX_GUESTS, Math.max(1, parseInt(d.guests, 10) || 1)),
    diet: DIETS.indexOf(d.diet) >= 0 ? d.diet : "None",
    note: String(d.note == null ? "" : d.note).replace(/\r/g, "").replace(/[ \t]+/g, " ").trim().slice(0, 500)
  };
  if (!g.name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email) || !g.attending) throw new Error("invalid reply");
  if (g.attending === "no") { g.guests = 0; g.diet = "None"; }
  return g;
}

/* Add or update the guest's row, then send the confirmation. The row is saved before any email goes out. */
function save(g) {
  const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SHEET_ID"));
  const sh = ss.getSheetByName(TAB);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const now = new Date();
    const n = Math.max(sh.getLastRow() - 1, 0);
    const emails = n ? sh.getRange(2, C.EMAIL, n, 1).getValues().map(r => String(r[0]).toLowerCase()) : [];
    const at = emails.indexOf(g.email);
    const vals = [g.name, g.email, g.phone, g.attending === "yes" ? "Yes" : "No", g.guests, g.diet, g.note];
    if (at >= 0) {
      const row = at + 2;
      const replies = Number(sh.getRange(row, C.REPLIES).getValue()) || 1;
      sh.getRange(row, C.UPDATED, 1, 9).setValues([[now].concat(vals).concat([replies + 1])]);
    } else {
      sh.appendRow([now, now].concat(vals).concat([1]));
    }
  } finally { lock.releaseLock(); }

  let confirmation = true;
  try { sendConfirmation(g); } catch (err) { confirmation = false; console.error("Confirmation failed: " + err); }
  return { ok: true, confirmation };
}

/* ---------- emails ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function sendConfirmation(g) {
  const yes = g.attending === "yes";
  const first = g.name.split(" ")[0];
  const rows = [
    ["Name", g.name], ["Attending", yes ? "Yes" : "No"],
    yes ? ["Number attending", String(g.guests)] : null,
    yes && g.diet !== "None" ? ["Dietary needs", g.diet] : null,
    g.phone ? ["Cell", g.phone] : null,
    g.note ? ["Your note", g.note] : null
  ].filter(Boolean);
  const intro = yes
    ? "Thank you for your RSVP. We have received it and your reservation is done. We cannot wait to celebrate with you."
    : "Thank you for letting us know. We have received your reply and we will miss you on the day.";
  const details = yes ? [["Date", EVENT.date], ["Ceremony", EVENT.ceremony], ["Reception", EVENT.reception],
    ["Venue", EVENT.venue], ["Dress code", EVENT.dress], ["Please note", EVENT.adults]] : [];
  const closing = "Need to change something? Just reply to this email and we will update your reservation. You can also contact " + RSVP_CONTACT + " (RSVP).";

  const text = ["Dear " + first + ",", "", intro, "", "YOUR REPLY"].concat(rows.map(r => r[0] + ": " + r[1]))
    .concat(details.length ? ["", "THE DAY"].concat(details.map(r => r[0] + ": " + r[1])) : [])
    .concat(["", closing, "", "With love,", EVENT.couple]).join("\n");

  const tr = r => '<tr><td style="padding:4px 14px 4px 0;color:#9a9a9a;font-size:13px;letter-spacing:.08em;text-transform:uppercase;vertical-align:top">' + esc(r[0]) + '</td><td style="padding:4px 0;color:#e6e6e6;font-size:16px">' + esc(r[1]) + "</td></tr>";
  const html = '<div style="background:#020202;padding:0"><div style="max-width:520px;margin:0 auto;padding:36px 24px;background:#141414;color:#d8d8d8;font-family:Georgia,\'Times New Roman\',serif;line-height:1.55">' +
    '<p style="margin:0 0 6px;text-align:center;font-size:12px;letter-spacing:.3em;color:#b4b4b4">14 NOVEMBER 2026 · GAUTENG</p>' +
    '<h1 style="margin:0 0 22px;text-align:center;font-weight:normal;font-size:26px;letter-spacing:.14em;color:#f2f2f2">MODIRI &amp; PHEMELO</h1>' +
    '<p style="margin:0 0 14px;font-size:17px">Dear ' + esc(first) + ",</p>" +
    '<p style="margin:0 0 22px;font-size:17px">' + esc(intro) + "</p>" +
    '<p style="margin:0 0 6px;font-size:12px;letter-spacing:.24em;color:#b4b4b4">YOUR REPLY</p><table role="presentation" style="border-collapse:collapse;margin-bottom:22px">' + rows.map(tr).join("") + "</table>" +
    (details.length ? '<p style="margin:0 0 6px;font-size:12px;letter-spacing:.24em;color:#b4b4b4">THE DAY</p><table role="presentation" style="border-collapse:collapse;margin-bottom:22px">' + details.map(tr).join("") + "</table>" : "") +
    '<p style="margin:0 0 22px;font-size:16px;color:#b4b4b4;font-style:italic">' + esc(closing) + "</p>" +
    '<p style="margin:0;font-size:17px">With love,<br>' + esc(EVENT.couple) + "</p></div></div>";

  const opts = { to: g.email, subject: "Your RSVP is confirmed · " + EVENT.couple, body: text, htmlBody: html, name: SENDER_NAME };
  if (REPLY_TO) opts.replyTo = REPLY_TO;
  MailApp.sendEmail(opts);
}

/* Daily at 07:00 (script time zone): new replies since the last digest. Sends nothing on quiet days. */
function sendDigest() {
  const props = PropertiesService.getScriptProperties();
  const ss = SpreadsheetApp.openById(props.getProperty("SHEET_ID"));
  const sh = ss.getSheetByName(TAB);
  const since = Number(props.getProperty("LAST_DIGEST")) || 0;
  const n = Math.max(sh.getLastRow() - 1, 0);
  if (!n) return;
  const data = sh.getRange(2, 1, n, HEAD.length).getValues();
  const fresh = data.filter(r => new Date(r[C.UPDATED - 1]).getTime() > since);
  props.setProperty("LAST_DIGEST", String(Date.now()));
  if (!fresh.length) return;
  const yes = data.filter(r => r[C.ATT - 1] === "Yes");
  const head = yes.reduce((s, r) => s + (Number(r[C.NUM - 1]) || 0), 0);
  const lines = fresh.map(r => "- " + r[C.NAME - 1] + ": " + r[C.ATT - 1] + (r[C.ATT - 1] === "Yes" ? " (" + r[C.NUM - 1] + ")" : "") + (r[C.DIET - 1] && r[C.DIET - 1] !== "None" ? ", " + r[C.DIET - 1] : ""));
  const body = [fresh.length + " new or updated RSVP(s):", ""].concat(lines).concat(["",
    "Totals so far: " + data.length + " replies, " + yes.length + " attending (" + head + " people), " + (data.length - yes.length) + " declined.",
    "", "Sheet: " + ss.getUrl()]).join("\n");
  MailApp.sendEmail({ to: DIGEST_TO || Session.getEffectiveUser().getEmail(), subject: "RSVP digest: " + fresh.length + " new · " + head + " attending", body, name: SENDER_NAME });
}

/* Optional check: adds a TEST row and sends a confirmation to the address below. Delete the row afterwards. */
function testRsvp() {
  const me = Session.getEffectiveUser().getEmail();
  Logger.log(JSON.stringify(save(clean({ name: "TEST Guest", email: me, phone: "000", attending: "yes", guests: 2, diet: "Vegetarian", note: "Test row, please delete." }))));
}
