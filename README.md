# Modiri & Phemelo wedding site

Static site (no build step). Edit the `SITE` block near the bottom of `index.html` to change details.

- `gallery.json` lists gallery photos (`{ "src": "photos/x.jpg", "thumb": "photos/thumb/x.jpg", "alt": "..." }`; `thumb` is optional, a ~640px version for the grid)
- Set `preview: false` in `SITE` to remove the sample-details banner
- Deploys to Vercel as a static site on every push to `main`
