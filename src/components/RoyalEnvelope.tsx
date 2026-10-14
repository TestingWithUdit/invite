import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { SoftBackdrop } from './SoftBackdrop';
import { eventConfig } from '../config/event';
import { useReducedMotion } from '../hooks/useReducedMotion';

type RoyalEnvelopeProps = {
  onOpened: () => void;
};

export function RoyalEnvelope({ onOpened }: RoyalEnvelopeProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [letterOut, setLetterOut] = useState(false);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    window.setTimeout(() => setLetterOut(true), reduced ? 100 : 700);
    window.setTimeout(() => onOpened(), reduced ? 400 : 1800);
  };

  return (
    <section
      id="royal-envelope"
      className="paper-grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--color-champagne)] px-5 py-16 safe-pad"
      aria-labelledby="envelope-heading"
    >
      <SoftBackdrop mood="ivory" />
      <h2 id="envelope-heading" className="sr-only">
        Open the royal invitation envelope
      </h2>

      <p className="relative z-10 mb-8 font-display text-xl text-[var(--color-maroon)] sm:text-2xl">
        An invitation awaits
      </p>

      <button
        type="button"
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
        aria-label={open ? 'Envelope opened' : 'Open the royal envelope'}
        aria-expanded={open}
        disabled={open}
        className="group relative z-10 w-[min(90vw,340px)] cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default"
      >
        <motion.div
          className="relative aspect-[4/3] w-full"
          style={{ perspective: 900 }}
          animate={
            reduced || open
              ? undefined
              : { y: [0, -6, 0], filter: ['brightness(1)', 'brightness(1.05)', 'brightness(1)'] }
          }
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Envelope body */}
          <div
            className="absolute inset-x-0 bottom-0 top-[22%] rounded-b-md border-2 border-[var(--color-gold)]"
            style={{
              background:
                'linear-gradient(160deg, #5c1a28 0%, #3d1018 55%, #6b1e2a 100%)',
              boxShadow: '0 18px 40px rgba(74,20,32,0.35)',
            }}
          />

          {/* Flap */}
          <motion.div
            className="absolute inset-x-0 top-0 origin-top"
            style={{
              height: '48%',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              background: 'linear-gradient(180deg, #7a2434 0%, #4a1420 100%)',
              borderTop: '2px solid var(--color-gold)',
              zIndex: open ? 1 : 4,
            }}
            animate={{ rotateX: open ? -160 : 0 }}
            transition={{ duration: reduced ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Letter */}
          <AnimatePresence>
            {(open || letterOut) && (
              <motion.div
                className="absolute left-1/2 top-[18%] z-[3] w-[78%] -translate-x-1/2 rounded-sm border border-[var(--color-gold)] bg-[var(--color-ivory)] px-4 py-5 text-center shadow-lg"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: letterOut ? -30 : 10, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <p className="font-display text-sm tracking-widest text-[var(--color-gold)]">
                  {eventConfig.occasion.toUpperCase()}
                </p>
                <p className="mt-2 font-display text-2xl text-[var(--color-maroon)]">
                  {eventConfig.bride} & {eventConfig.groom}
                </p>
                <img
                  src={eventConfig.assets.couple}
                  alt=""
                  className="mx-auto mt-3 h-16 w-auto object-contain opacity-90"
                  aria-hidden
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wax seal */}
          {!open && (
            <div
              className="absolute left-1/2 top-[42%] z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--color-gold-light)] shadow-md"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, #a83245, #5c1520 70%)',
              }}
              aria-hidden
            >
              <span className="font-display text-sm font-semibold text-[var(--color-gold-light)]">
                {eventConfig.initials}
              </span>
            </div>
          )}

          {/* Floral corners */}
          <span
            className="pointer-events-none absolute bottom-2 left-2 h-8 w-8 border-b border-l border-[var(--color-gold)] opacity-70"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute bottom-2 right-2 h-8 w-8 border-b border-r border-[var(--color-gold)] opacity-70"
            aria-hidden
          />
        </motion.div>
      </button>

      <p className="relative z-10 mt-8 text-sm text-[var(--color-burgundy)]/70">
        {open ? 'Unfolding your invitation…' : 'Tap the envelope to open'}
      </p>
    </section>
  );
}
