import confetti from 'canvas-confetti';
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

  const celebrate = useCallback(() => {
    if (reduced) return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#c4a35a', '#e8d5a3', '#6b1e2a', '#f7f1e8'],
    });
  }, [reduced]);

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current !== null) {
      window.clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const finishReveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    clearAutoTimer();
    setRevealed(true);
    setSecondsLeft(0);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
    }
    celebrate();
    onRevealed?.();
  }, [celebrate, clearAutoTimer, onRevealed]);

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

  // Start 5s auto-scratch countdown once this section is on screen
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
    autoTimerRef.current = window.setInterval(() => {
      if (revealedRef.current) {
        clearAutoTimer();
        return;
      }
      const left = Math.max(0, Math.ceil((AUTO_SCRATCH_MS - (Date.now() - startedAt)) / 1000));
      setSecondsLeft(left);
      if (left <= 0) {
        clearAutoTimer();
        finishReveal();
      }
    }, 200);

    return clearAutoTimer;
  }, [clearAutoTimer, finishReveal, inView, revealed]);

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealedRef.current) return;
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
      finishReveal();
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

        {!revealed && inView && (
          <p
            className="mt-3 font-sans text-xs tracking-wide text-[var(--color-maroon)]/80"
            aria-live="polite"
          >
            Auto-reveal in {secondsLeft}s if you don’t scratch
          </p>
        )}

        <div
          ref={containerRef}
          className="ornament-border relative mx-auto mt-6 aspect-[1.4/1] w-full overflow-hidden rounded-xl bg-[var(--color-ivory)]"
        >
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 px-4">
            <p className="font-display text-2xl font-medium text-[var(--color-maroon)] sm:text-3xl">
              {eventConfig.dateDisplay}
            </p>
            <p className="font-sans text-sm tracking-wide text-[var(--color-burgundy)]">
              {eventConfig.timeDisplay}
            </p>
          </div>

          {!revealed && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 z-10 touch-none transition-opacity duration-700"
              style={{ touchAction: 'none', opacity: ready ? 1 : 0 }}
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

          {!revealed && (
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-ivory)_85%,transparent)] px-3 py-1 text-xs text-[var(--color-burgundy)]">
              <Hand size={14} aria-hidden />
              Drag to scratch
            </div>
          )}
        </div>

        {revealed && (
          <p className="mt-5 font-display text-sm italic text-[var(--color-burgundy)]/80">
            Scroll down when you’re ready for the invitation details
          </p>
        )}

        <button
          type="button"
          className="mt-6 text-sm font-medium text-[var(--color-maroon)] underline decoration-[var(--color-gold)] underline-offset-4 disabled:opacity-40"
          onClick={finishReveal}
          disabled={revealed}
        >
          Reveal the Date
        </button>
      </div>
    </section>
  );
}
