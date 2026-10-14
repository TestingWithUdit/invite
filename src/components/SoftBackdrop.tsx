import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type SoftBackdropProps = {
  /** ivory | blush | dusk */
  mood?: 'ivory' | 'blush' | 'dusk';
};

const moodGlow: Record<NonNullable<SoftBackdropProps['mood']>, string> = {
  ivory:
    'radial-gradient(ellipse 80% 50% at 50% 12%, rgba(232,213,163,0.38), transparent 55%), radial-gradient(ellipse 45% 40% at 12% 78%, rgba(196,92,106,0.08), transparent 50%), radial-gradient(ellipse 40% 35% at 88% 70%, rgba(201,168,76,0.14), transparent 50%)',
  blush:
    'radial-gradient(ellipse 75% 48% at 50% 20%, rgba(232,180,190,0.28), transparent 55%), radial-gradient(ellipse 50% 40% at 80% 85%, rgba(201,168,76,0.16), transparent 50%), radial-gradient(ellipse 40% 35% at 15% 60%, rgba(107,30,42,0.06), transparent 50%)',
  dusk:
    'radial-gradient(ellipse 70% 45% at 50% 15%, rgba(201,168,76,0.22), transparent 55%), radial-gradient(ellipse 55% 50% at 50% 100%, rgba(20,8,12,0.4), transparent 60%)',
};

export function SoftBackdrop({ mood = 'ivory' }: SoftBackdropProps) {
  const reduced = useReducedMotion();
  const dust = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${8 + ((i * 23) % 84)}%`,
        top: `${10 + ((i * 17) % 75)}%`,
        size: 2 + (i % 3),
        delay: (i % 5) * 0.4,
        duration: 4 + (i % 4),
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background: moodGlow[mood] }} />

      {/* Soft drifting light orbs */}
      {!reduced && (
        <>
          <motion.div
            className="absolute -left-16 top-1/4 h-56 w-56 rounded-full opacity-40 blur-3xl"
            style={{ background: 'rgba(201,168,76,0.35)' }}
            animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -right-12 bottom-1/4 h-64 w-64 rounded-full opacity-30 blur-3xl"
            style={{
              background:
                mood === 'dusk' ? 'rgba(201,168,76,0.25)' : 'rgba(180,80,100,0.22)',
            }}
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Tiny gold dust */}
      {!reduced &&
        dust.map((d) => (
          <motion.span
            key={d.id}
            className="absolute rounded-full"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              background:
                mood === 'dusk'
                  ? 'rgba(240,223,176,0.7)'
                  : 'rgba(201,168,76,0.55)',
              boxShadow: '0 0 6px rgba(201,168,76,0.35)',
            }}
            animate={{ opacity: [0.15, 0.85, 0.15], y: [0, -12, 0] }}
            transition={{
              duration: d.duration,
              delay: d.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

      {/* Delicate lotus watermark — very light */}
      <svg
        className="absolute left-1/2 top-[8%] h-[min(55vw,280px)] w-[min(55vw,280px)] -translate-x-1/2 opacity-[0.07]"
        viewBox="0 0 120 120"
        fill="none"
      >
        <g stroke={mood === 'dusk' ? '#e8d5a3' : '#6b1e2a'} strokeWidth="1.2">
          <ellipse cx="60" cy="62" rx="18" ry="28" transform="rotate(0 60 62)" />
          <ellipse cx="60" cy="62" rx="18" ry="28" transform="rotate(40 60 62)" />
          <ellipse cx="60" cy="62" rx="18" ry="28" transform="rotate(80 60 62)" />
          <ellipse cx="60" cy="62" rx="18" ry="28" transform="rotate(120 60 62)" />
          <ellipse cx="60" cy="62" rx="18" ry="28" transform="rotate(160 60 62)" />
          <circle cx="60" cy="62" r="8" fill={mood === 'dusk' ? '#e8d5a3' : '#c4a35a'} fillOpacity="0.35" />
        </g>
      </svg>
    </div>
  );
}
