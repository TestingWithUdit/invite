import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { SoftBackdrop } from './SoftBackdrop';
import { eventConfig, getEventStartUtc } from '../config/event';
import { useCountdown } from '../hooks/useCountdown';
import { useReducedMotion } from '../hooks/useReducedMotion';

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function CountdownTimer() {
  const reduced = useReducedMotion();
  const target = useMemo(() => getEventStartUtc(), []);
  const { days, hours, minutes, seconds, isComplete } = useCountdown(target);

  const units = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ];

  return (
    <section
      id="countdown"
      className="paper-grain relative flex min-h-[70dvh] flex-col items-center justify-center overflow-hidden bg-[var(--color-burgundy)] px-5 py-20 text-[var(--color-ivory)] safe-pad"
      aria-labelledby="countdown-heading"
    >
      <SoftBackdrop mood="dusk" />
      <motion.div
        className="relative z-10 w-full max-w-2xl text-center"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8 }}
      >
        <h2
          id="countdown-heading"
          className="font-display text-3xl sm:text-4xl"
        >
          Countdown to Our Special Day
        </h2>
        <p className="mt-2 text-sm text-[var(--color-gold-light)]/80">
          {eventConfig.dateDisplay} · Asia/Kolkata
        </p>

        {isComplete ? (
          <p className="mt-12 font-display text-2xl text-[var(--color-gold-light)]">
            {eventConfig.copy.celebrationEnded}
          </p>
        ) : (
          <div
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
            role="timer"
            aria-live="polite"
            aria-atomic="true"
          >
            {units.map((u) => (
              <div
                key={u.label}
                className="rounded-xl border border-[color-mix(in_srgb,var(--color-gold)_45%,transparent)] bg-[color-mix(in_srgb,black_25%,transparent)] px-3 py-5"
              >
                <p className="font-display text-4xl tabular-nums text-[var(--color-gold-light)] sm:text-5xl">
                  {pad(u.value)}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--color-ivory)]/70">
                  {u.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
