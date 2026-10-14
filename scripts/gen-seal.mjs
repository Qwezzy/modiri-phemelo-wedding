// Generates public/seal.svg and src/app/icon.svg (wavy wax-seal blob, MP monogram).
import { writeFileSync } from "fs";
const N = 180, pts = [];
for (let i = 0; i < N; i++) {
  const t = (i / N) * Math.PI * 2;
  const r = 104 + 5 * Math.sin(7 * t) + 3 * Math.sin(13 * t + 1) + 2.2 * Math.sin(3 * t + 0.5) + 1.2 * Math.sin(23 * t);
  pts.push([120 + r * Math.cos(t), 120 + r * Math.sin(t)]);
}
const blob = "M" + pts.map((p) => p.map((v) => v.toFixed(2)).join(",")).join("L") + "Z";
const defs = `<defs>
<radialGradient id="g" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#f4f5f6"/><stop offset=".35" stop-color="#c3c6ca"/><stop offset=".7" stop-color="#8a8e93"/><stop offset="1" stop-color="#4a4d51"/></radialGradient>
<linearGradient id="r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9eaec"/><stop offset=".5" stop-color="#7d8186"/><stop offset="1" stop-color="#d4d6d9"/></linearGradient>
<radialGradient id="in" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#c9ccd0"/><stop offset="1" stop-color="#8e9297"/></radialGradient>
<filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#000" flood-opacity=".75"/></filter>
<filter id="emb"><feDropShadow dx="-1" dy="-1" stdDeviation=".4" flood-color="#fff" flood-opacity=".7"/><feDropShadow dx="1.2" dy="1.6" stdDeviation=".6" flood-color="#2a2c2f" flood-opacity=".9"/></filter>
</defs>`;
const body = `<g filter="url(#s)"><path d="${blob}" fill="url(#g)"/></g>
<path d="${blob}" fill="none" stroke="#ffffff" stroke-opacity=".25" stroke-width="1.2" transform="translate(-1,-1)"/>
<circle cx="120" cy="120" r="78" fill="url(#in)"/>
<circle cx="120" cy="120" r="78" fill="none" stroke="url(#r)" stroke-width="7" filter="url(#emb)"/>
<circle cx="120" cy="120" r="70" fill="none" stroke="#6d7176" stroke-opacity=".6" stroke-width=".8"/>
<g filter="url(#emb)" fill="#a7abb0" font-family="Didot, 'Bodoni 72', 'Playfair Display', 'Times New Roman', serif">
<text x="104" y="146" font-size="82" text-anchor="middle" font-style="normal">M</text>
<text x="140" y="152" font-size="82" text-anchor="middle" font-style="italic">P</text>
<path d="M62 152 C 92 172, 140 140, 182 158 C 170 168, 150 170, 136 164" fill="none" stroke="#a7abb0" stroke-width="2.4" stroke-linecap="round"/>
</g>
<ellipse cx="92" cy="72" rx="26" ry="10" fill="#fff" opacity=".18" transform="rotate(-30 92 72)"/>`;
const svg = (w) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="${w}" height="${w}">${defs}${body}</svg>`;
writeFileSync("public/seal.svg", svg(240));
writeFileSync("src/app/icon.svg", svg(64));
