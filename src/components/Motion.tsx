"use client";
// Interactions modelled on the Framer reference: load intro, letter-stagger titles, sticky nav,
// live countdown, scroll parallax, scroll-drawn timeline, staggered card reveals, smooth scroll.
// Motion only: no visual restyle. All of it respects prefers-reduced-motion.
import { motion, MotionConfig, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function MotionRoot({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let id = 0;
    const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const el = document.querySelector(a.getAttribute("href")!);
      if (el) { e.preventDefault(); lenis.scrollTo(el as HTMLElement, { offset: -60 }); }
    };
    document.addEventListener("click", onClick);
    return () => { cancelAnimationFrame(id); lenis.destroy(); document.removeEventListener("click", onClick); };
  }, [reduce]);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/* Hero load intro: lines rise in sequence, seal presses in like a wax stamp. */
export const heroParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } } };
export const heroLine: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 1.1, ease } } };
export const heroRule: Variants = { hidden: { scaleX: 0, opacity: 0 }, show: { scaleX: 1, opacity: 1, transition: { duration: 1.1, ease } } };
export const sealStamp: Variants = {
  hidden: { opacity: 0, scale: 1.35, filter: "blur(6px)" },
  show: { opacity: 1, scale: [1.35, 0.96, 1], filter: "blur(0px)", transition: { duration: 1.3, times: [0, 0.7, 1], ease } },
};

export function HeroIntro({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);
  return (
    <motion.div ref={ref} className={className} style={{ y, opacity }} variants={heroParent} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}
export const M = motion;

/* Per-letter stagger reveal (reference does this on the couple's names and headings). */
export function Letters({ text, className = "", delay = 0, inView = false }: { text: string; className?: string; delay?: number; inView?: boolean }) {
  const parent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: delay } } };
  const child: Variants = { hidden: { opacity: 0, y: "0.45em" }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } };
  const trigger = inView ? { whileInView: "show", viewport: { once: true, amount: 0.6 } } : { animate: "show" };
  return (
    <motion.span className={`${className} inline-block`} aria-label={text} variants={parent} initial="hidden" {...trigger}>
      {Array.from(text).map((c, i) => (
        <motion.span key={i} aria-hidden variants={child} className="inline-block" style={{ whiteSpace: "pre" }}>{c}</motion.span>
      ))}
    </motion.span>
  );
}

/* Fade-up on scroll, optionally staggering direct motion children. */
export function FadeUp({ children, className = "", delay = 0, x = 0 }: { children: React.ReactNode; className?: string; delay?: number; x?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28, x }} whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1.1, ease, delay }}>
      {children}
    </motion.div>
  );
}

/* Scroll-linked parallax drift (reference floats its floral elements). */
export function Parallax({ children, distance = 60, className = "" }: { children: React.ReactNode; distance?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
}

/* Timeline line that draws as you scroll through it. */
export function DrawLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div ref={ref} aria-hidden className={`absolute top-0 bottom-0 w-px bg-silver/15 ${className}`}>
      <motion.div className="absolute inset-0 bg-silver/70 origin-top" style={{ scaleY }} />
    </div>
  );
}

/* Sticky nav that fades in once the hero is passed. */
export function StickyNav({ links }: { links: { href: string; label: string }[] }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.75);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <motion.nav aria-label="Sections" initial={false} animate={{ opacity: show ? 1 : 0, y: show ? 0 : -16 }}
      transition={{ duration: 0.6, ease }} style={{ pointerEvents: show ? "auto" : "none" }}
      className="fixed top-3 md:top-6 inset-x-3 md:inset-x-6 z-30 flex justify-center">
      <div className="flex items-center gap-4 md:gap-8 px-4 md:px-8 py-3 bg-[#101010]/85 backdrop-blur-sm border-b border-ivory/20 overflow-x-auto max-w-full">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="heading text-[0.62rem] md:text-xs whitespace-nowrap text-ivory/80 hover:text-ivory transition-colors">{l.label}</a>
        ))}
      </div>
    </motion.nav>
  );
}

/* Live countdown (reference has days/hours/minutes/seconds under its date). */
export function Countdown({ iso }: { iso: string }) {
  const target = new Date(iso).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const d = Math.max(0, target - (now ?? target));
  const parts = [["Days", Math.floor(d / 864e5)], ["Hours", Math.floor(d / 36e5) % 24], ["Minutes", Math.floor(d / 6e4) % 60], ["Seconds", Math.floor(d / 1e3) % 60]] as const;
  return (
    <div className="flex justify-center gap-6 md:gap-12" aria-live="off">
      {parts.map(([l, v]) => (
        <div key={l} className="text-center min-w-[3.2rem]">
          <p className="heading text-3xl md:text-5xl tabular-nums" suppressHydrationWarning>{now === null ? "—" : String(v).padStart(2, "0")}</p>
          <p className="heading text-[0.6rem] md:text-[0.7rem] mt-2 text-ivory/70">{l}</p>
        </div>
      ))}
    </div>
  );
}

/* Horizontal drag/snap slider with arrows (used for Where to stay). */
export function Slider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; s: number; moved: boolean } | null>(null);
  const step = (dir: number) => { const el = ref.current; if (!el) return; const card = el.querySelector<HTMLElement>("[data-slide]"); el.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 24), behavior: "smooth" }); };
  return (
    <div>
      <div ref={ref} data-lenis-prevent-wheel=""
        className="slider flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-8 px-8 md:mx-0 md:px-0 cursor-grab active:cursor-grabbing select-none"
        onPointerDown={(e) => { if (e.pointerType !== "mouse") return; drag.current = { x: e.clientX, s: ref.current!.scrollLeft, moved: false }; ref.current!.style.scrollSnapType = "none"; }}
        onPointerMove={(e) => { const d = drag.current; if (!d) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 4) d.moved = true; ref.current!.scrollLeft = d.s - dx; }}
        onPointerUp={() => { if (!drag.current) return; drag.current = null; const el = ref.current!; el.style.scrollSnapType = ""; }}
        onPointerLeave={() => { if (drag.current) { drag.current = null; ref.current!.style.scrollSnapType = ""; } }}
        onClickCapture={(e) => { if (drag.current?.moved) e.preventDefault(); }}>
        {children}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button type="button" aria-label="Previous" className="btn-silver !px-5" onClick={() => step(-1)}>←</button>
        <button type="button" aria-label="Next" className="btn-silver !px-5" onClick={() => step(1)}>→</button>
      </div>
    </div>
  );
}
