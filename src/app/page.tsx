import Seal, { SealBullet } from "@/components/Seal";
import Reveal from "@/components/Reveal";
import RsvpForm from "@/components/RsvpForm";
import { Botanical, FlapDivider, Hairline } from "@/components/Ornaments";
import { accommodation, accommodationNote, arrival, contact, couple, directions, event, gpsNote, mapsEmbedUrl, mapsLinkUrl, registry, timeline } from "@/lib/content";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-8 md:px-16 py-16 md:py-24">
      <Reveal className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <SealBullet />
          <h2 className="heading text-lg md:text-xl text-center">{title}</h2>
          <SealBullet />
        </div>
        <Hairline className="mb-12" />
        {children}
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <main className="pb-16">
      {/* Hero: mirrors the approved save-the-date card */}
      <header className="hero relative min-h-[100svh] flex items-center justify-center px-6 py-12">
        <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="0,9 50,37 100,9 100,0 0,0" fill="#ffffff" fillOpacity="0.022" />
          <polyline points="0,9 50,37 100,9" fill="none" stroke="#000" strokeOpacity="0.7" strokeWidth="0.35" />
          <polyline points="0,9.3 50,37.3 100,9.3" fill="none" stroke="#fff" strokeOpacity="0.05" strokeWidth="0.2" />
          <polyline points="0,60 29,35" fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="0.3" />
          <polyline points="100,60 71,35" fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="0.3" />
          <polyline points="0,60.3 29,35.3" fill="none" stroke="#fff" strokeOpacity="0.04" strokeWidth="0.2" />
          <polyline points="100,60.3 71,35.3" fill="none" stroke="#fff" strokeOpacity="0.04" strokeWidth="0.2" />
        </svg>
        <div className="text-center hero-in relative">
          <p className="t t-std">Save the date</p>
          <span className="rule" style={{ width: "calc(var(--u) * 210)", marginTop: "calc(var(--u) * 26)" }} />
          <Seal hero className="seal block" />
          <h1>
            <span className="t t-name block">{couple.first}</span>
            <span className="t t-weds block">weds</span>
            <span className="t t-name block">{couple.second}</span>
          </h1>
          <span className="rule" style={{ width: "calc(var(--u) * 175)", margin: "calc(var(--u) * 44) auto calc(var(--u) * 38)" }} />
          <p className="t t-date">{event.dateLong}</p>
          <p className="t t-place">{event.town} · {event.region}</p>
          <span className="rule" style={{ width: "calc(var(--u) * 175)", margin: "calc(var(--u) * 28) auto calc(var(--u) * 24)" }} />
          <a href="#rsvp" className="btn-silver">RSVP</a>
        </div>
      </header>

      <FlapDivider />
      <Section id="our-day" title="Our day">
        <p className="text-center text-ivory/80 mb-12">{event.venueName} · {event.venueSpace}</p>
        <ol className="relative ml-4 md:ml-0 md:mx-auto md:max-w-md border-l border-silver/40 space-y-12">
          {timeline.map((t, i) => (
            <li key={i} className="pl-8 relative">
              <span className="absolute -left-[9px] top-1"><SealBullet /></span>
              <p className="heading text-[0.7rem] text-silver">{t.time}</p>
              <p className="heading text-base mt-2">{t.title}</p>
              <p className="mt-2 text-ivory/75">{t.detail}</p>
            </li>
          ))}
        </ol>
        <Botanical className="mt-16" />
      </Section>

      <FlapDivider />
      <Section id="rsvp" title="RSVP">
        <RsvpForm />
      </Section>

      <FlapDivider />
      <Section id="getting-there" title="Getting there">
        <p className="text-center">{event.venueName}<br /><span className="text-ivory/75">{event.address}</span></p>
        <div className="mt-10 border border-ivory/40 p-2">
          <iframe title="Map to Suitability Gardens" src={mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-72 md:h-96 block" style={{ filter: "grayscale(1) invert(.92) contrast(.9)" }} />
        </div>
        <div className="mt-10 space-y-8">
          {directions.map((d) => (
            <div key={d.from}><p className="heading text-xs text-silver">{d.from}</p><p className="mt-2 text-ivory/85">{d.text}</p></div>
          ))}
          <p className="italic text-ivory/85">{gpsNote}</p>
          {arrival.map((a) => (
            <div key={a.label}><p className="heading text-xs text-silver">{a.label}</p><p className="mt-2 text-ivory/85">{a.text}</p></div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <a href={mapsLinkUrl} target="_blank" rel="noopener noreferrer" className="btn-silver">Open in Google Maps</a>
          <a href={event.venueUrl} target="_blank" rel="noopener noreferrer" className="btn-silver">Venue website</a>
        </div>
      </Section>

      <FlapDivider />
      <Section id="stay" title="Where to stay">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accommodation.map((s) => (
            <article key={s.name} className="border border-ivory/30 p-6 text-center flex flex-col">
              <p className="heading text-xs leading-relaxed">{s.name}</p>
              {s.address && <p className="mt-2 text-sm text-ivory/60 italic">{s.address}</p>}
              <Hairline className="my-5 w-8" />
              <p className="text-ivory/85">{s.distance}</p>
              <p className="text-ivory/75">{s.priceBand}</p>
              {s.note && <p className="mt-3 text-sm text-ivory/65 italic">{s.note}</p>}
              {s.phone && <p className="mt-2 text-sm"><a href={`tel:${s.phone.replace(/\s/g, "")}`} className="text-silver underline-offset-4 hover:underline">{s.phone}</a></p>}
              <div className="mt-auto pt-6">
                {s.url && (s.url.startsWith("tel:")
                  ? <a href={s.url} className="btn-silver">{s.urlLabel ?? "Call to book"}</a>
                  : <a href={s.url} target="_blank" rel="noopener noreferrer" className="btn-silver">{s.urlLabel ?? "Book"}</a>)}
              </div>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center text-sm italic text-ivory/70">{accommodationNote}</p>
      </Section>

      <FlapDivider />
      <Section id="registry" title="Gift registry">
        <p className="text-center text-ivory/80 mb-10">Your presence is the greatest gift.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          {registry.map((r, i) => r.url
            ? <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="btn-silver">{r.label}</a>
            : <span key={i} className="btn-silver" aria-disabled="true">{r.label}</span>)}
        </div>
        <Botanical className="mt-16" flip />
      </Section>

      <footer className="text-center px-8 pt-12 pb-10">
        <Seal size={84} className="mx-auto w-[84px] h-auto" />
        <p className="heading text-xs mt-6">{couple.first} &amp; {couple.second} · {event.dateShort}</p>
        <p className="mt-4 text-ivory/70 italic">{contact.text}</p>
      </footer>
    </main>
  );
}
