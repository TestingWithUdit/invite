import { motion } from 'framer-motion';
import { Music2, Pause } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function MusicToggle() {
  const { playing, available, songTitle, toggle } = useMusic();
  const reduced = useReducedMotion();

  if (!available) {
    return (
      <div
        className="fixed bottom-5 right-5 z-50 max-w-[220px] rounded-2xl border border-[var(--color-gold)]/50 bg-[var(--color-ivory)]/95 px-3 py-2 text-left text-[11px] leading-snug text-[var(--color-burgundy)] shadow-lg backdrop-blur-md"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        role="status"
      >
        Song ready — drop <strong>aaj-se-teri-karaoke.mp3</strong> in{' '}
        <code className="text-[10px]">public/assets/audio/</code> then refresh.
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={() => void toggle()}
      aria-label={playing ? `Pause ${songTitle}` : `Play ${songTitle}`}
      aria-pressed={playing}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-[var(--color-gold)] bg-gradient-to-r from-[var(--color-maroon)] to-[var(--color-burgundy)] py-2 pl-2 pr-4 text-left text-[var(--color-ivory)] shadow-[0_12px_40px_rgba(74,20,32,0.35)] backdrop-blur-md"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      whileHover={reduced ? undefined : { scale: 1.03 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
    >
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-gold)] text-[var(--color-burgundy)]">
        {playing ? <Pause size={18} aria-hidden /> : <Music2 size={18} aria-hidden />}
        {playing && !reduced && (
          <motion.span
            className="absolute inset-0 rounded-full border border-[var(--color-gold-light)]"
            animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            aria-hidden
          />
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-sm leading-tight">
          {songTitle}
        </span>
        <span className="block text-[10px] uppercase tracking-[0.18em] text-[var(--color-gold-light)]/90">
          {playing ? 'Now playing' : 'Starting… tap if silent'}
        </span>
      </span>
    </motion.button>
  );
}
