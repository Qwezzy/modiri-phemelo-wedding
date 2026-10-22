# Modiri & Phemelo wedding site

Static site (no build step). Edit the `SITE` block near the bottom of `index.html` to change details.

- `gallery.json` lists gallery photos (`{ "src": "photos/x.jpg", "thumb": "photos/thumb/x.jpg", "alt": "..." }`; `thumb` is optional, a ~640px version for the grid; `pos` is an optional CSS object-position such as "50% 20%" to keep faces in the square tile)
- `wishlist.html` is the Bride & Groom Wishlist Reference (reference only, not a shop). Items live in `wishlist.json` as `{ "asOf": "October 2026", "items": [{ "name": "...", "price": 1159, "img": "wishlist/x.jpg", "alt": "...", "note": "optional" }] }`; `price` is rand as a number or a ready-made string
- Set `preview: false` in `SITE` to remove the sample-details banner
- Deploys to Vercel as a static site on every push to `main`

## RSVP to a Google Sheet

The form posts to `/api/rsvp` (Vercel function: validation, honeypot, rate limit), which passes the reply to a Google Apps Script
web app (`apps-script/Code.gs`). The script adds the reply to the **RSVPs** sheet (one row per guest email, a repeat reply updates
that row), emails the guest a confirmation, and sends the owner a daily 07:00 digest on days with new replies. A **Summary** tab
totals replies, headcount and dietary needs. If the function or script is unreachable the form shows an error with a
"send from your own email app" mailto fallback to `phasha8@gmail.com` (the couple's address, set in `SITE.rsvpEmail`).

One-time setup, from the Google account that should own the sheet:

1. script.google.com > New project. Paste `apps-script/Code.gs`, replace `PASTE_SECRET_HERE` with a long random string.
2. Run `setup` (authorise when asked). It creates the sheet and the Summary tab; the link is in the execution log.
3. Optional: run `testRsvp` to add a TEST row and receive a confirmation. Delete the row afterwards.
4. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Copy the `/exec` URL.
5. In Vercel (Production) set `APPS_SCRIPT_URL` to that URL and `APPS_SCRIPT_SECRET` to the same random string, then redeploy.

Handing over to the couple: open the sheet > Share, or File > Make a copy from their account and repeat steps 1 to 5 there.
Gmail sends up to about 100 confirmations a day from a free account. Event wording in the confirmation is at the top of `Code.gs`.

## Logo files

- `logo.svg`: monogram only (used by the favicon workflow and as the base artwork).
- `logo-nav.svg`: monogram with "MODIRI WEDS PHEMELO" beside it, for the header.
- `logo-full.svg`: monogram with the names stacked below, for the footer.
The names are outlined from Cormorant SC, so they render the same on every device. No webfont needed.
