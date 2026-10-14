import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink: "#0b0b0b", charcoal: "#1c1c1c", ivory: "#f1ede4", silver: "#b9bcc0" },
    fontFamily: { display: ["var(--font-display)", "serif"], body: ["var(--font-body)", "serif"] },
  } },
  plugins: [],
} satisfies Config;
