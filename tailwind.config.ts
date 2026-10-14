import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink: "#101010", charcoal: "#1c1c1c", ivory: "#d6d2cc", silver: "#b9bcc0" },
    fontFamily: { display: ["var(--font-display)", "serif"], body: ["var(--font-body)", "serif"] },
  } },
  plugins: [],
} satisfies Config;
