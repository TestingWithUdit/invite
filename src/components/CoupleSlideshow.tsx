import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { eventConfig } from '../config/event';
import { useReducedMotion } from '../hooks/useReducedMotion';

const AUTO_MS = 3000;

export function CoupleSlideshow() {
  const reduced = useReducedMotion();
  const slides = eventConfig.assets.coupleSlides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    if (paused || reduced || slides.length <= 1) return;
    const id = window.setInterval(next, AUTO_MS);
    return () => window.clearInterval(id);
  }, [next, paused, reduced, slides.length]);

  const slide = slides[index];
  const variants = {
    enter: (dir: number) =>
      reduced
        ? { opacity: 0 }
        : { x: dir > 0 ? 48 : -48, opacity: 0, scale: 0.98 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) =>
      reduced
        ? { opacity: 0 }
        : { x: dir > 0 ? -48 : 48, opacity: 0, scale: 0.98 },
  };

  return (
    <div
      className="ornament-border relative w-full overflow-hidden rounded-[1.25rem] bg-[var(--color-champagne)]/40 p-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[0.9rem] bg-[var(--color-ivory)]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduced ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-contain object-center"
            draggable={false}
            decoding="async"
          />
        </AnimatePresence>

        {/* Subtle autoplay progress — easy to remove if you dislike it */}
        {!paused && !reduced && slides.length > 1 && (
          <motion.div
            key={`progress-${slide.src}`}
            className="absolute bottom-0 left-0 h-0.5 bg-[var(--color-gold)]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
            aria-hidden
          />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-gold)]/60 bg-[var(--color-ivory)] text-[var(--color-maroon)] transition hover:bg-[var(--color-champagne)]"
        >
          <ChevronLeft size={18} aria-hidden />
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Couple photos">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show photo ${i + 1}`}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? 'w-6 bg-[var(--color-maroon)]'
                  : 'w-2.5 bg-[var(--color-gold)]/55 hover:bg-[var(--color-gold)]'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-gold)]/60 bg-[var(--color-ivory)] text-[var(--color-maroon)] transition hover:bg-[var(--color-champagne)]"
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      </div>

      <p className="mt-2 text-center font-display text-sm italic text-[var(--color-burgundy)]/75">
        {slide.caption}
      </p>
    </div>
  );
}
