import { motion } from 'framer-motion';
import { ArrowUp, CalendarHeart, Heart, MessageCircle } from 'lucide-react';
import { FloatingPetals } from './FloatingPetals';
import { SoftBackdrop } from './SoftBackdrop';
import { eventConfig, getWhatsAppRsvpUrl } from '../config/event';
import { useReducedMotion } from '../hooks/useReducedMotion';

function buildIcs(): string {
  const start = '20261128T183000';
  const end = '20261128T223000';
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
  const summary = `${eventConfig.bride} & ${eventConfig.groom} — ${eventConfig.occasion}`;
  const location = `${eventConfig.venue.name}, ${eventConfig.venue.locality}`;
  const description = `${eventConfig.occasion} of ${eventConfig.bride} & ${eventConfig.groom}. ${eventConfig.timeDisplay}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ChestaUdit//RingCeremony//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:ring-ceremony-${eventConfig.dateISO}@chesta-udit`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Asia/Kolkata:${start}`,
    `DTEND;TZID=Asia/Kolkata:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function downloadIcs() {
  const blob = new Blob([buildIcs()], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chesta-udit-ring-ceremony.ics';
  a.click();
  URL.revokeObjectURL(url);
}

export function FinalCelebration() {
  const reduced = useReducedMotion();
  const whatsapp = getWhatsAppRsvpUrl();

  return (
    <section
      id="celebration"
      className="paper-grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--color-ivory)] px-5 py-20 safe-pad"
      aria-labelledby="final-heading"
    >
      <SoftBackdrop mood="blush" />
      <FloatingPetals count={16} density="medium" />

      <motion.div
        className="relative z-10 flex max-w-lg flex-col items-center text-center"
        initial={reduced ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9 }}
      >
        <motion.div
          animate={reduced ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart
            className="text-[var(--color-maroon)]"
            size={36}
            fill="currentColor"
            aria-hidden
          />
        </motion.div>

        <h2
          id="final-heading"
          className="mt-6 font-display text-3xl leading-snug text-[var(--color-maroon)] sm:text-4xl"
        >
          {eventConfig.copy.finalMessage}
        </h2>
        <p className="mt-4 font-display text-xl italic text-[var(--color-burgundy)]">
          {eventConfig.copy.withLove}
        </p>

        <img
          src={eventConfig.assets.couple}
          alt=""
          className="mt-8 h-28 w-auto object-contain opacity-95"
          loading="lazy"
          aria-hidden
        />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={downloadIcs}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)] bg-gradient-to-b from-[var(--color-gold-light)] to-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-[var(--color-burgundy)] shadow-md transition hover:brightness-105"
          >
            <CalendarHeart size={18} aria-hidden />
            Save the Date
          </button>

          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-maroon)] bg-[var(--color-maroon)] px-6 py-3 text-sm font-medium text-[var(--color-ivory)]"
            >
              <MessageCircle size={18} aria-hidden />
              RSVP on WhatsApp
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
          className="mt-10 inline-flex items-center gap-2 text-sm text-[var(--color-burgundy)]/80 underline decoration-[var(--color-gold)] underline-offset-4"
        >
          <ArrowUp size={16} aria-hidden />
          Back to top
        </button>
      </motion.div>

      <footer className="relative z-10 mt-16 border-t border-[color-mix(in_srgb,var(--color-gold)_35%,transparent)] pt-6 text-center text-sm text-[var(--color-burgundy)]/70">
        <p className="font-display text-lg text-[var(--color-maroon)]">
          {eventConfig.bride} & {eventConfig.groom}
        </p>
        <p>
          {eventConfig.occasion} · {eventConfig.dateDisplay}
        </p>
      </footer>
    </section>
  );
}
