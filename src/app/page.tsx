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
      {/* Hero */}
      <header className="relative min-h-[100svh] flex items-center justify-center px-8 py-20 flaps">
        <div className="text-center hero-in">
          <p className="heading text-xs md:text-sm text-ivory/90">Save the date</p>
          <Hairline className="mt-4 mb-10" />
          <Seal size={180} className="mx-auto w-36 h-36 md:w-48 md:h-48" />
          <h1 className="mt-10">
            <span className="heading block text-3xl md:text-5xl">{couple.first}</span>
            <span className="heading block text-xs md:text-sm my-3 text-ivory/80">weds</span>
            <span className="heading block text-3xl md:text-5xl">{couple.second}</span>
          </h1>
          <Hairline className="my-8" />
          <p className="heading text-lg md:text-2xl">{event.dateLong}</p>
          <p className="heading text-[0.7rem] md:text-xs mt-3 text-ivory/80">{event.town} · {event.region}</p>
          <Hairline className="my-8" />
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
        <Seal size={80} className="mx-auto w-20 h-20" />
        <p className="heading text-xs mt-6">{couple.first} &amp; {couple.second} · {event.dateShort}</p>
        <p className="mt-4 text-ivory/70 italic">{contact.text}</p>
      </footer>
    </main>
  );
}
