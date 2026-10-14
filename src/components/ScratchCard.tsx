import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { Hand } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { SoftBackdrop } from './SoftBackdrop';
import { eventConfig } from '../config/event';
import { useReducedMotion } from '../hooks/useReducedMotion';

type ScratchCardProps = {
  onRevealed?: () => void;
};

const REVEAL_THRESHOLD = 0.4;
const AUTO_SCRATCH_MS = 5000;
const RING_SIZE = 72;
const RING_STROKE = 5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

export function ScratchCard({ onRevealed }: ScratchCardProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const drawing = useRef(false);
  const revealedRef = useRef(false);
  const autoTimerRef = useRef<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [progress, setProgress] = useState(0); // 0 → 1 over 5s
  const [autoWiping, setAutoWiping] = useState(false);

  const celebrate = useCallback(() => {
    if (reduced) return;
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#c4a35a', '#e8d5a3', '#6b1e2a', '#f7f1e8', '#c45c6a'],
    });
  }, [reduced]);

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current !== null) {
      window.clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  /** Sweep wipe animation for auto-reveal */
  const animatedAutoWipe = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setAutoWiping(true);
    const cssW = canvas.clientWidth || 1;
    const cssH = canvas.clientHeight || 1;
    const steps = reduced ? 6 : 28;
    const duration = reduced ? 280 : 900;
    const stepMs = duration / steps;

    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      // Diagonal soft wipe
      const wipeW = cssW * 0.35;
      const x = -wipeW + t * (cssW + wipeW * 2);
      const grad = ctx.createLinearGradient(x, 0, x + wipeW, cssH);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.45, 'rgba(0,0,0,1)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cssW, cssH);
      // Also clear a growing circle from center for sparkle feel
      ctx.beginPath();
      ctx.arc(cssW / 2, cssH / 2, Math.max(cssW, cssH) * 0.55 * t, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      await new Promise((r) => window.setTimeout(r, stepMs));
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.opacity = '0';
    canvas.style.pointerEvents = 'none';
    setAutoWiping(false);
  }, [reduced]);

  const finishReveal = useCallback(
    async (mode: 'manual' | 'auto' = 'manual') => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      clearAutoTimer();
      setSecondsLeft(0);
      setProgress(1);

      if (mode === 'auto') {
        await animatedAutoWipe();
      } else {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.style.transition = 'opacity 0.65s ease';
          canvas.style.opacity = '0';
          canvas.style.pointerEvents = 'none';
          await new Promise((r) => window.setTimeout(r, reduced ? 120 : 650));
        }
      }

      setRevealed(true);
      celebrate();
      onRevealed?.();
    },
    [animatedAutoWipe, celebrate, clearAutoTimer, onRevealed, reduced],
  );

  const scratchedPercent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return 0;
    const { width, height } = canvas;
    const pixels = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    const step = 4 * 8;
    for (let i = 3; i < pixels.length; i += step) {
      if (pixels[i] < 128) transparent += 1;
    }
    const samples = Math.ceil(pixels.length / step);
    return transparent / samples;
  }, []);

  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#d4b56a');
    gradient.addColorStop(0.35, '#f0e0b0');
    gradient.addColorStop(0.55, '#c4a35a');
    gradient.addColorStop(1, '#a8843a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    for (let i = -h; i < w + h; i += 14) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h * 0.4, h);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(74,20,32,0.55)';
    ctx.font = '600 16px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch here', w / 2, h / 2);
    setReady(true);
  }, []);

  useEffect(() => {
    if (revealed) return;
    paintFoil();
    const onResize = () => {
      if (!revealedRef.current) paintFoil();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [paintFoil, revealed]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || revealed || revealedRef.current) return;

    const startedAt = Date.now();
    setSecondsLeft(5);
    setProgress(0);
    autoTimerRef.current = window.setInterval(() => {
      if (revealedRef.current) {
        clearAutoTimer();
        return;
      }
      const elapsed = Date.now() - startedAt;
      const p = Math.min(1, elapsed / AUTO_SCRATCH_MS);
      setProgress(p);
      const left = Math.max(0, Math.ceil((AUTO_SCRATCH_MS - elapsed) / 1000));
      setSecondsLeft(left);
      if (elapsed >= AUTO_SCRATCH_MS) {
        clearAutoTimer();
        void finishReveal('auto');
      }
    }, 50);

    return clearAutoTimer;
  }, [clearAutoTimer, finishReveal, inView, revealed]);

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealedRef.current || autoWiping) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    if (scratchedPercent() >= REVEAL_THRESHOLD) {
      void finishReveal('manual');
    }
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    e.preventDefault();
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    drawing.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const dashOffset = RING_CIRC * (1 - progress);

  return (
    <section
      ref={sectionRef}
      id="scratch-date"
      className="paper-grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--color-champagne)] px-5 py-20 safe-pad"
      aria-labelledby="scratch-heading"
    >
      <SoftBackdrop mood="ivory" />
      <div className="relative z-10 w-full max-w-md text-center">
        <h2
          id="scratch-heading"
          className="font-display text-3xl text-[var(--color-maroon)] sm:text-4xl"
        >
          {eventConfig.copy.scratchTitle}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-burgundy)]/75">
          {eventConfig.copy.scratchSubtitle}
        </p>

        {/* Big animated countdown */}
        <AnimatePresence>
          {!revealed && inView && (
            <motion.div
              className="mt-5 flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              aria-live="polite"
            >
              <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
                <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
                  <circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke="rgba(196,163,90,0.25)"
                    strokeWidth={RING_STROKE}
                  />
                  <motion.circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke="var(--color-maroon)"
                    strokeWidth={RING_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRC}
                    strokeDashoffset={dashOffset}
                    style={{ transition: reduced ? undefined : 'stroke-dashoffset 50ms linear' }}
                  />
                </svg>
                <motion.span
                  key={secondsLeft}
                  className="absolute inset-0 flex items-center justify-center font-display text-3xl font-semibold text-[var(--color-maroon)]"
                  initial={reduced ? false : { scale: 1.25, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                >
                  {secondsLeft}
                </motion.span>
              </div>
              <p className="font-sans text-xs uppercase tracking-[0.22em] text-[var(--color-burgundy)]/80">
                {autoWiping ? 'Revealing…' : 'Auto-reveal timer'}
              </p>
              {/* Linear progress bar */}
              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-gold)_30%,transparent)]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-maroon)]"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={containerRef}
          className="ornament-border relative mx-auto mt-6 aspect-[1.4/1] w-full overflow-hidden rounded-xl bg-[var(--color-ivory)]"
        >
          <motion.div
            className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 px-4"
            animate={
              revealed && !reduced
                ? { scale: [0.96, 1.03, 1], opacity: [0.7, 1] }
                : undefined
            }
            transition={{ duration: 0.7 }}
          >
            <p className="font-display text-2xl font-medium text-[var(--color-maroon)] sm:text-3xl">
              {eventConfig.dateDisplay}
            </p>
            <p className="font-sans text-sm tracking-wide text-[var(--color-burgundy)]">
              {eventConfig.timeDisplay}
            </p>
          </motion.div>

          {!revealed && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 z-10 touch-none"
              style={{
                touchAction: 'none',
                opacity: ready ? 1 : 0,
                transition: autoWiping ? undefined : 'opacity 0.4s ease',
              }}
              role="img"
              aria-label="Gold foil scratch layer covering the event date"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
          )}

          <span className="pointer-events-none absolute left-2 top-2 z-20 h-6 w-6 border-l border-t border-[var(--color-gold)]" aria-hidden />
          <span className="pointer-events-none absolute right-2 top-2 z-20 h-6 w-6 border-r border-t border-[var(--color-gold)]" aria-hidden />
          <span className="pointer-events-none absolute bottom-2 left-2 z-20 h-6 w-6 border-b border-l border-[var(--color-gold)]" aria-hidden />
          <span className="pointer-events-none absolute bottom-2 right-2 z-20 h-6 w-6 border-b border-r border-[var(--color-gold)]" aria-hidden />

          {!revealed && !autoWiping && (
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-ivory)_85%,transparent)] px-3 py-1 text-xs text-[var(--color-burgundy)]">
              <Hand size={14} aria-hidden />
              Drag to scratch
            </div>
          )}

          {autoWiping && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-r from-transparent via-[rgba(255,248,230,0.35)] to-transparent"
              animate={{ x: ['-40%', '120%'] }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              aria-hidden
            />
          )}
        </div>

        {revealed && (
          <motion.p
            className="mt-5 font-display text-sm italic text-[var(--color-burgundy)]/80"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Scroll down when you’re ready for the invitation details
          </motion.p>
        )}

        <button
          type="button"
          className="mt-6 text-sm font-medium text-[var(--color-maroon)] underline decoration-[var(--color-gold)] underline-offset-4 disabled:opacity-40"
          onClick={() => void finishReveal('manual')}
          disabled={revealed || autoWiping}
        >
          Reveal the Date
        </button>
      </div>
    </section>
  );
}
