import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type FloatingPetalsProps = {
  count?: number;
  density?: 'light' | 'medium';
  className?: string;
};

const PETAL_COLORS = [
  'linear-gradient(145deg, #e8a0a8 0%, #c45c6a 55%, #9e3d4a 100%)',
  'linear-gradient(145deg, #f0c4a8 0%, #d4896a 60%, #b86a4a 100%)',
  'linear-gradient(145deg, #f2d78a 0%, #c9a84c 55%, #a8843a 100%)',
  'linear-gradient(145deg, #f5b8c0 0%, #d47888 50%, #b05060 100%)',
  'linear-gradient(145deg, #ffe8f0 0%, #e89aaa 70%, #c46a7a 100%)',
];

export function FloatingPetals({
  count = 14,
  density = 'light',
  className = '',
}: FloatingPetalsProps) {
  const reduced = useReducedMotion();
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const sizeBase = density === 'light' ? 18 : 24;
        return {
          id: i,
          left: `${(i * 11 + 4) % 96}%`,
          // Stagger starts quickly so petals are visible right away
          delay: (i % 6) * 0.35,
          duration: 9 + (i % 5) * 1.6,
          size: sizeBase + (i % 5) * 5,
          drift: (i % 2 === 0 ? 1 : -1) * (28 + (i % 5) * 14),
          swirl: (i % 2 === 0 ? 1 : -1) * (120 + (i % 4) * 40),
          // Start some already on-screen so nothing waits at the top
          startY: -8 - (i % 4) * 6,
          color: PETAL_COLORS[i % PETAL_COLORS.length],
          blur: i % 3 === 0 ? 0.4 : 0,
          opacityPeak: 0.55 + (i % 4) * 0.1,
        };
      }),
    [count, density],
  );

  if (reduced) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: `${p.startY}%`,
            width: p.size,
            height: p.size * 1.15,
            background: p.color,
            borderRadius: '70% 10% 70% 10%',
            filter: `blur(${p.blur}px)`,
            boxShadow: '0 2px 8px rgba(122, 36, 52, 0.18)',
            transformOrigin: '50% 60%',
          }}
          animate={{
            y: [`${p.startY}vh`, '118vh'],
            x: [0, p.drift * 0.55, p.drift, p.drift * 0.25],
            rotate: [p.swirl * -0.15, p.swirl * 0.55, p.swirl],
            opacity: [0, p.opacityPeak, p.opacityPeak * 0.9, 0],
            scale: [0.9, 1.08, 1, 0.92],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.1, 0.8, 1],
          }}
        />
      ))}
    </div>
  );
}
