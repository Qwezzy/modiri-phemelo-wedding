"use client";
import { useState } from "react";
import { dietaryOptions, event } from "@/lib/content";
import { submitRsvp } from "@/lib/rsvp";

export default function RsvpForm() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"" | "yes" | "no">("");
  const [guests, setGuests] = useState(1);
  const [dietary, setDietary] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Please enter your full name.";
    if (!attending) e.attending = "Please let us know if you can attend.";
    if (attending === "yes" && (!Number.isInteger(guests) || guests < 1 || guests > 10)) e.guests = "Please enter between 1 and 10 guests.";
    if (dietary.includes("Allergies") && !notes.trim()) e.notes = "Please tell us about the allergies.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setState("sending");
    await submitRsvp({ name: name.trim(), attending: attending as "yes" | "no", guests: attending === "yes" ? guests : 0, dietary, dietaryNotes: notes.trim() });
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="text-center py-10" role="status">
        <p className="font-display text-2xl tracking-[0.25em] uppercase">Thank you</p>
        <p className="mt-4 text-ivory/80">{attending === "yes" ? "We can't wait to celebrate with you." : "You'll be missed. Thank you for letting us know."}</p>
      </div>
    );
  }

  const label = "block font-display text-xs tracking-[0.3em] uppercase text-ivory/80 mb-2";
  const input = "w-full bg-transparent border border-silver/40 px-4 py-3 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-silver";
  const err = (k: string) => errors[k] && <p className="mt-2 text-sm text-ivory/90 italic">{errors[k]}</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8 text-left">
      <div>
        <label htmlFor="name" className={label}>Name</label>
        <input id="name" className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Full name" />
        {err("name")}
      </div>
      <fieldset>
        <legend className={label}>Attending</legend>
        <div className="flex gap-6">
          {(["yes", "no"] as const).map((v) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="attending" value={v} checked={attending === v} onChange={() => setAttending(v)} className="accent-[#b9bcc0]" />
              <span>{v === "yes" ? "Joyfully accepts" : "Regretfully declines"}</span>
            </label>
          ))}
        </div>
        {err("attending")}
      </fieldset>
      {attending !== "no" && (
        <div>
          <label htmlFor="guests" className={label}>Number of guests</label>
          <input id="guests" type="number" min={1} max={10} className={`${input} max-w-[8rem]`} value={guests} onChange={(e) => setGuests(parseInt(e.target.value || "0", 10))} />
          {err("guests")}
        </div>
      )}
      <fieldset>
        <legend className={label}>Dietary needs</legend>
        <div className="flex flex-wrap gap-6">
          {dietaryOptions.map((d) => (
            <label key={d} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={dietary.includes(d)} onChange={() => setDietary((s) => (s.includes(d) ? s.filter((x) => x !== d) : [...s, d]))} className="accent-[#b9bcc0]" />
              <span>{d}</span>
            </label>
          ))}
        </div>
        <textarea aria-label="Other dietary notes" className={`${input} mt-4 min-h-[96px]`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies or anything else we should know" />
        {err("notes")}
      </fieldset>
      <p className="text-sm text-ivory/70 italic text-center">RSVPs close on {event.rsvpDeadline}</p>
      <div className="text-center">
        <button type="submit" className="btn-silver" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send RSVP"}</button>
      </div>
    </form>
  );
}
