/**
 * Central event configuration — update names, date, venue, maps, RSVP, and assets here.
 * Paths use import.meta.env.BASE_URL so GitHub Pages deploys resolve correctly.
 */

const base = import.meta.env.BASE_URL;

export const eventConfig = {
  bride: 'Chesta',
  groom: 'Udit',
  initials: 'C & U',
  occasion: 'Ring Ceremony',
  tagline: 'Two hearts, one beautiful beginning.',

  /** Event start in Asia/Kolkata (IST). Parsed as local IST wall-clock. */
  dateISO: '2026-11-28',
  timeISO: '18:30',
  timeZone: 'Asia/Kolkata',
  dateDisplay: 'Saturday, 28 November 2026',
  timeDisplay: '6:30 PM onwards',

  venue: {
    name: 'Golden Dream Vista',
    locality: 'Noida Extension',
    /** Google Maps search URL — no fabricated coordinates */
    mapsSearchQuery: 'Golden Dream Vista, Noida Extension',
  },

  /** Leave empty to hide WhatsApp RSVP button */
  rsvpWhatsApp: '' as string,

  music: {
    title: 'Aaj Se Teri',
    subtitle: 'Padman · Karaoke',
  },

  assets: {
    ganesha: `${base}assets/ganesha/ganesha-blessing.jpg`,
    /** Fallback / envelope thumbnail */
    couple: `${base}assets/couple/slide-03-ring-ceremony.png`,
    /**
     * Meet the Couple animated slideshow (in order).
     * Files live in public/assets/couple/
     */
    coupleSlides: [
      {
        src: `${base}assets/couple/slide-03-ring-ceremony.png`,
        alt: 'Chesta and Udit at their Ring Ceremony celebration',
        caption: 'Our Ring Ceremony',
      },
      {
        src: `${base}assets/couple/slide-02-groom-bride.png`,
        alt: 'Chesta and Udit — meet the groom and bride scrapbook portrait',
        caption: 'Meet the Groom & Bride',
      },
      {
        src: `${base}assets/couple/slide-04-sunset-jeep.png`,
        alt: 'Chesta and Udit — romantic sunset portrait under a floral arch',
        caption: 'A Beautiful Beginning',
      },
    ],
    /**
     * Place your licensed karaoke MP3 here:
     * public/assets/audio/aaj-se-teri-karaoke.mp3
     */
    audio: `${base}assets/audio/aaj-se-teri-karaoke.mp3`,
  },

  copy: {
    ganeshaMantra: '॥ श्री गणेशाय नमः ॥',
    ganeshaSupport: 'With the blessings of Lord Ganesha',
    beginCta: 'Begin Our Celebration',
    scratchTitle: 'A Special Day Awaits...',
    scratchSubtitle: 'Scratch to discover our special day.',
    inviteLead: 'Together with our families',
    inviteBody:
      'Request the pleasure of your company as we celebrate our Ring Ceremony.',
    finalMessage:
      "We can't wait to celebrate this beautiful beginning with you.",
    withLove: 'With love, Chesta & Udit',
    celebrationEnded: 'The celebration has begun — thank you for being part of our story.',
  },
} as const;

export type EventConfig = typeof eventConfig;

/** Absolute Instant for countdown (IST wall time → UTC). */
export function getEventStartUtc(): Date {
  // 2026-11-28 18:30 IST = 2026-11-28 13:00 UTC
  return new Date(`${eventConfig.dateISO}T${eventConfig.timeISO}:00+05:30`);
}

export function getMapsUrl(): string {
  const q = encodeURIComponent(eventConfig.venue.mapsSearchQuery);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function getWhatsAppRsvpUrl(): string | null {
  const phone = eventConfig.rsvpWhatsApp.replace(/\D/g, '');
  if (!phone) return null;
  const text = encodeURIComponent(
    `Namaste! I would love to attend ${eventConfig.bride} & ${eventConfig.groom}'s ${eventConfig.occasion} on ${eventConfig.dateDisplay}.`,
  );
  return `https://wa.me/${phone}?text=${text}`;
}
