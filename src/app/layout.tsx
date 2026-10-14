import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-display" });
const body = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Modiri weds Phemelo · 14 November 2026",
  description: "You are invited to celebrate the wedding of Modiri and Phemelo on 14 November 2026 at Suitability Gardens, De Deur, Gauteng.",
  openGraph: { title: "Modiri weds Phemelo · 14 November 2026", description: "14 November 2026 · Suitability Gardens, De Deur, Gauteng", images: ["/og.png"] },
};
export const viewport: Viewport = { themeColor: "#101010" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body text-lg antialiased">
        <div className="frame" aria-hidden />
        {children}
      </body>
    </html>
  );
}
