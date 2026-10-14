import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CoupleSlideshow } from './CoupleSlideshow';
import { FloatingPetals } from './FloatingPetals';
import { SoftBackdrop } from './SoftBackdrop';
import { eventConfig } from '../config/event';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function CoupleIntroduction() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -40]);
  const glow = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.4, 1, 0.5]);

  return (
    <section
      ref={ref}
      id="meet-the-couple"
      className="paper-grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--color-ivory)] px-5 py-20 safe-pad"
      aria-labelledby="couple-heading"
    >
      <SoftBackdrop mood="blush" />
      <FloatingPetals count={18} density="medium" />

      <motion.div
        className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center"
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9 }}
      >
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
          Meet the Couple
        </p>
        <h2
          id="couple-heading"
          className="font-display text-4xl font-medium text-[var(--color-maroon)] sm:text-5xl md:text-6xl"
        >
          {eventConfig.bride} & {eventConfig.groom}
        </h2>
        <p className="mt-4 max-w-md font-display text-lg italic text-[var(--color-burgundy)]/90 sm:text-xl">
          {eventConfig.tagline}
        </p>

        <motion.div className="relative mt-10 w-full max-w-md" style={{ y }}>
          <motion.div
            className="absolute -inset-4 rounded-[2rem] opacity-60 blur-2xl"
            style={{
              opacity: glow,
              background:
                'radial-gradient(circle, rgba(196,163,90,0.4), transparent 70%)',
            }}
            aria-hidden
          />
          <CoupleSlideshow />
        </motion.div>
      </motion.div>
    </section>
  );
}
