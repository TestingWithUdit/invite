import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FloatingPetals } from './FloatingPetals';
import { SoftBackdrop } from './SoftBackdrop';
import { eventConfig } from '../config/event';
import { useMusic } from '../context/MusicContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

type GaneshOpeningProps = {
  onBegin: () => void;
};

/** Soft finger + ripple cue so guests know to press Begin */
function BeginClickHint({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 z-20"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.45 }}
      aria-hidden
    >
      {/* Expanding ripples */}
      {!reduced &&
        [0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-gold)]"
            animate={{ scale: [0.6, 1.8], opacity: [0.55, 0] }}
            transition={{
              duration: 1.6,
              delay: i * 0.55,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}

      {/* Finger / cursor tip */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-[20%] -translate-y-[10%]"
        animate={
          reduced
            ? undefined
            : {
                y: [0, 10, 0],
                scale: [1, 0.9, 1],
              }
        }
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_6px_12px_rgba(74,20,32,0.35)]"
        >
          <path
            d="M28 8c0-2.2 1.8-4 4-4s4 1.8 4 4v20.5l3.2-2.4a4.2 4.2 0 0 1 5.9.7l.4.5a4.2 4.2 0 0 1-.6 5.9L32.5 52.2A10 10 0 0 1 26 54H18a6 6 0 0 1-6-6V30a4 4 0 0 1 4-4h2V8z"
            fill="#6b1e2a"
            stroke="#e8d5a3"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="36" cy="36" r="5" fill="#c4a35a" opacity="0.9" />
        </svg>
      </motion.div>

      <motion.p
        className="absolute left-1/2 top-[4.75rem] w-40 -translate-x-1/2 text-center font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-maroon)]"
        animate={reduced ? undefined : { opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        Tap to begin
      </motion.p>
    </motion.div>
  );
}

export function GaneshOpening({ onBegin }: GaneshOpeningProps) {
  const reduced = useReducedMotion();
  const { play } = useMusic();
  const [showHint, setShowHint] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) return;
    const id = window.setTimeout(() => setShowHint(true), 5000);
    return () => window.clearTimeout(id);
  }, [started]);

  const handleBegin = async () => {
    setStarted(true);
    setShowHint(false);
    await play();
    onBegin();
  };

  return (
    <section
      id="shubh-aarambh"
      className="paper-grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--color-ivory)] px-5 py-16 safe-pad"
      aria-labelledby="ganesha-heading"
    >
      <SoftBackdrop mood="ivory" />
      <FloatingPetals count={16} density="medium" />

      <motion.div
        className="relative z-10 flex max-w-lg flex-col items-center text-center"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative mb-8">
          <div
            className="absolute left-1/2 top-1/2 h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
            style={{
              background:
                'conic-gradient(from 0deg, transparent, rgba(196,163,90,0.35), transparent, rgba(196,163,90,0.25), transparent)',
            }}
            aria-hidden
          />
          <img
            src={eventConfig.assets.ganesha}
            alt="Respectful illustration of Lord Ganesha"
            width={320}
            height={320}
            className="relative z-[1] mx-auto h-auto w-[min(72vw,280px)] rounded-full object-cover shadow-[0_20px_60px_rgba(74,20,32,0.18)]"
            decoding="async"
          />
        </div>

        <h1
          id="ganesha-heading"
          className="font-display text-3xl font-medium tracking-wide text-[var(--color-maroon)] sm:text-4xl"
        >
          {eventConfig.copy.ganeshaMantra}
        </h1>
        <p className="mt-3 font-display text-lg italic text-[var(--color-burgundy)]/85 sm:text-xl">
          {eventConfig.copy.ganeshaSupport}
        </p>

        <div className="relative mt-10 inline-flex flex-col items-center">
          {/* Soft attention pulse once hint is active */}
          <AnimatePresence>
            {showHint && !started && !reduced && (
              <motion.span
                className="absolute inset-0 -m-1 rounded-full bg-[var(--color-gold)]/25"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.08, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                aria-hidden
              />
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={() => void handleBegin()}
            className="relative rounded-full border border-[var(--color-gold)] bg-[var(--color-maroon)] px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-[var(--color-ivory)] shadow-[0_10px_28px_rgba(74,20,32,0.22)] transition hover:bg-[var(--color-burgundy)]"
            animate={
              showHint && !started && !reduced
                ? { scale: [1, 1.04, 1] }
                : undefined
            }
            transition={
              showHint && !started
                ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
                : undefined
            }
            whileHover={reduced ? undefined : { scale: 1.03 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
          >
            {eventConfig.copy.beginCta}
          </motion.button>

          <AnimatePresence>
            {showHint && !started && <BeginClickHint reduced={reduced} />}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
