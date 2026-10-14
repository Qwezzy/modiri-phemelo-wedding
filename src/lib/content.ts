// All copy and data for the invite. Swap values here; components read from this file.
export const couple = { first: "Modiri", second: "Phemelo", monogram: "MP" };

export const event = {
  dateLong: "14 November 2026",
  dateShort: "14.11.2026",
  region: "Gauteng Province",
  town: "De Deur",
  venueName: "Suitability Gardens",
  venueSpace: "Garden Court",
  address: "236 1st Road, Walkers Fruit Farms, De Deur, Gauteng",
  venueUrl: "https://suitabilitygardens.co.za/weddings/",
  rsvpDeadline: "7 November 2026",
};

export const mapsQuery = encodeURIComponent(`${event.venueName}, ${event.address}`);
export const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
export const mapsLinkUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

// PLACEHOLDER: ceremony time TBC. Do not add invented times.
export const timeline = [
  { time: "Morning · time to be confirmed", title: "Ceremony", detail: `In the ${event.venueSpace} at ${event.venueName}. Ceremony: morning, time to be confirmed.` },
  { time: "From 3pm", title: "Pictures", detail: "Photographs with the couple and family." },
  { time: "Details to follow", title: "Celebration", detail: "Details to follow." },
];

export const directions = [
  { from: "From Johannesburg", text: "Head south on the R59 toward Vereeniging, take the De Deur / R82 route, and follow it to Walkers Fruit Farms, 1st Road." },
  { from: "From Pretoria", text: "Take the N1 south to the R59 south, then continue as from Johannesburg via the De Deur / R82 route." },
];
export const gpsNote = "Follow GPS to 236 1st Road, Walkers Fruit Farms.";
// PLACEHOLDER: parking / drop-off to be confirmed with the venue.
export const arrival = [
  { label: "Parking", text: "On-site parking at the venue (to be confirmed)." },
  { label: "Uber drop-off", text: "Drop-off at the main entrance (to be confirmed)." },
];

// Accommodation list from Seeker. Unverified prices show "Rates on request" — never invent numbers.
export type Stay = { name: string; address?: string; distance: string; priceBand: string; url?: string; urlLabel?: string; phone?: string; note?: string };
export const accommodation: Stay[] = [
  { name: "Suitability Gardens", address: "The venue", distance: "On site", priceBand: "Rates on request", url: "https://www.airpaz.com/en/hotel/suitability-gardens.1971858", note: "Garden setting, deluxe double rooms, limited rooms." },
  { name: "Gasela Guest House", address: "494 Cider Rd, Walkers Fruit Farms", distance: "~5 min", priceBand: "Rates on request", url: "https://bnbfinder.co.za/places/gasela-guest-house/", phone: "+27 78 833 2971", note: "Pool and restaurant on site." },
  { name: "Ayana Country Lodge", address: "349 Boundary Rd, Walkers Fruit Farms", distance: "~5 min", priceBand: "Rates on request", url: "tel:+27832727810", urlLabel: "Call to book", phone: "+27 83 272 7810" },
  { name: "Tuis Guest House", address: "Meyerton", distance: "~15 min", priceBand: "From R750/night", url: "https://tuiskoffie.co.za/stay", note: "Four vintage garden rooms, incl. family rooms." },
  { name: "Plaaskombuis Country Estate", address: "Meyerton", distance: "~15–20 min", priceBand: "R880–R1,200 per room (suites R1,500–R2,650)", url: "https://www.plaaskombuis.co.za/bb/", note: "Near the R59, with suites suited to getting ready." },
  { name: "The Village Guest House", address: "Henley-on-Klip", distance: "~15–20 min", priceBand: "From R700/night", url: "https://www.villageguesthouse.co.za/", note: "B&B rooms and self-catering cottages." },
  { name: "Waterfront Country Lodge & Spa", address: "Vanderbijlpark", distance: "~30–40 min", priceBand: "R1,400/night, 2 sharing incl. breakfast", url: "https://waterfrontlodge.co.za/waterfront-country-lodge-vaal-river-accommodation/", note: "Riverside, with spa." },
];
export const accommodationNote = "Drive times are approximate. Prices are as published by each host; please confirm rates and availability for 14 November when booking.";

// PLACEHOLDER: couple to send registry links.
export const registry: { label: string; url?: string }[] = [
  { label: "Registry link coming soon" },
  { label: "Registry link coming soon" },
];

// PLACEHOLDER: contact details to follow.
export const contact = { text: "Contact details to follow", email: "", phone: "" };

export const dietaryOptions = ["Vegetarian", "Halaal", "Allergies"] as const;
