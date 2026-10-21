# Modiri & Phemelo wedding site

Static site (no build step). Edit the `SITE` block near the bottom of `index.html` to change details.

- `gallery.json` lists gallery photos (`{ "src": "photos/x.jpg", "thumb": "photos/thumb/x.jpg", "alt": "..." }`; `thumb` is optional, a ~640px version for the grid; `pos` is an optional CSS object-position such as "50% 20%" to keep faces in the square tile)
- `wishlist.html` is the Bride & Groom Wishlist Reference (reference only, not a shop). Items live in `wishlist.json` as `{ "asOf": "October 2026", "items": [{ "name": "...", "price": 1159, "img": "wishlist/x.jpg", "alt": "...", "note": "optional" }] }`; `price` is rand as a number or a ready-made string
- Set `preview: false` in `SITE` to remove the sample-details banner
- Deploys to Vercel as a static site on every push to `main`

## RSVP by email

`api/rsvp.js` is a Vercel serverless function. The form posts to `/api/rsvp`, which emails the reply to `info@tsst.co.za`
(reply-to set to the guest) and sends the guest a confirmation. If the function is unreachable or not configured, the form
shows an error with a "send from your own email app" mailto fallback, so no reply is lost.

Set these in Vercel (Project > Settings > Environment Variables, Production), then redeploy:

| Variable | Value |
|---|---|
| `SMTP_HOST` | Mail server for the sending mailbox, e.g. the host from your tsst.co.za mailbox settings |
| `SMTP_PORT` | `465` (TLS, default) or `587` (STARTTLS) |
| `SMTP_USER` | Mailbox login, normally `info@tsst.co.za` |
| `SMTP_PASS` | That mailbox's password (or an app password) |
| `MAIL_FROM` | Optional. Default `Modiri & Phemelo <info@tsst.co.za>` |
| `RSVP_TO` | Optional. Default `info@tsst.co.za` |

Event wording in the confirmation email (date, times, venue, dress code) is fixed at the top of `api/rsvp.js`. Update it there
if the details change. Basic protection: same-site requests only, a hidden honeypot field, input length limits and a per-IP rate limit.
