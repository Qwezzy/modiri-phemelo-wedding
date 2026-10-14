export type RsvpPayload = {
  name: string;
  attending: "yes" | "no";
  guests: number;
  dietary: string[];
  dietaryNotes: string;
};

/**
 * DEV NOTE: stub only. No backend yet; this sends data NOWHERE.
 * TODO(backend): wire to Formspree, Supabase or email (to be decided) before go-live.
 */
export async function submitRsvp(payload: RsvpPayload): Promise<{ ok: true }> {
  if (process.env.NODE_ENV !== "production") console.info("[rsvp stub] not sent", payload);
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true };
}
