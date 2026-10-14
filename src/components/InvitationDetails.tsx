import { motion } from 'framer-motion';
import { Gem, MapPin } from 'lucide-react';
import { FloatingPetals } from './FloatingPetals';
import { SoftBackdrop } from './SoftBackdrop';
import { eventConfig, getMapsUrl } from '../config/event';
import { useReducedMotion } from '../hooks/useReducedMotion';

type InvitationDetailsProps = {
  visible: boolean;
};

export function InvitationDetails({ visible }: InvitationDetailsProps) {
  const reduced = useReducedMotion();

  if (!visible) return null;

  return (
    <section
      id="invitation"
      className="paper-grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--color-ivory)] px-5 py-20 safe-pad"
      aria-labelledby="invite-heading"
    >
      <SoftBackdrop mood="ivory" />
      <FloatingPetals count={12} />

      <motion.article
        className="ornament-border relative z-10 w-full max-w-lg rounded-2xl bg-[color-mix(in_srgb,var(--color-champagne)_55%,var(--color-ivory))] px-6 py-10 text-center sm:px-10"
        initial={reduced ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85 }}
      >
        <Gem
          className="mx-auto mb-4 text-[var(--color-gold)]"
          size={28}
          aria-hidden
        />
        <p className="font-display text-lg italic text-[var(--color-burgundy)]/80">
          {eventConfig.copy.inviteLead}
        </p>
        <h2
          id="invite-heading"
          className="mt-3 font-display text-4xl text-[var(--color-maroon)] sm:text-5xl"
        >
          {eventConfig.bride} & {eventConfig.groom}
        </h2>

        <div
          className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent"
          aria-hidden
        />

        <p className="font-display text-lg leading-relaxed text-[var(--color-ink)]/90">
          {eventConfig.copy.inviteBody}
        </p>

        <p className="mt-8 font-display text-2xl text-[var(--color-maroon)]">
          {eventConfig.dateDisplay}
        </p>
        <p className="mt-1 text-sm tracking-wide text-[var(--color-burgundy)]">
          {eventConfig.timeDisplay}
        </p>

        <div className="mt-8 space-y-1">
          <p className="font-display text-xl text-[var(--color-maroon)]">
            {eventConfig.venue.name}
          </p>
          <p className="text-sm text-[var(--color-burgundy)]/80">
            {eventConfig.venue.locality}
          </p>
        </div>

        <a
          href={getMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)] bg-[var(--color-maroon)] px-6 py-3 text-sm font-medium text-[var(--color-ivory)] transition hover:bg-[var(--color-burgundy)]"
        >
          <MapPin size={16} aria-hidden />
          Get Directions
        </a>
      </motion.article>
    </section>
  );
}
