import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { eventConfig } from '../config/event';

type MusicContextValue = {
  playing: boolean;
  available: boolean;
  songTitle: string;
  toggle: () => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wantsPlayRef = useRef(true); // default: music should be on
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(false);

  const tryPlay = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return false;
    try {
      await audio.play();
      setPlaying(true);
      return true;
    } catch {
      // Browser autoplay block — keep available, wait for a user gesture
      setPlaying(false);
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.42;
    audioRef.current = audio;

    const onError = () => {
      if (!cancelled) setAvailable(false);
    };
    const onPlaying = () => {
      if (!cancelled) setPlaying(true);
    };
    const onPause = () => {
      if (!cancelled) setPlaying(false);
    };

    audio.addEventListener('error', onError);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);

    void fetch(eventConfig.assets.audio, { method: 'HEAD' })
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          setAvailable(false);
          return;
        }
        audio.src = eventConfig.assets.audio;
        audio.load();
        setAvailable(true);
        // Try default play (may be blocked until gesture)
        if (wantsPlayRef.current) {
          await tryPlay();
        }
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });

    // Unlock autoplay on first tap/click/key anywhere
    const unlock = () => {
      if (!wantsPlayRef.current) return;
      void tryPlay().then((ok) => {
        if (ok) {
          document.removeEventListener('pointerdown', unlock);
          document.removeEventListener('keydown', unlock);
        }
      });
    };
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);

    return () => {
      cancelled = true;
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
      audio.pause();
      audio.removeEventListener('error', onError);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audioRef.current = null;
    };
  }, [tryPlay]);

  const play = useCallback(async () => {
    wantsPlayRef.current = true;
    await tryPlay();
  }, [tryPlay]);

  const pause = useCallback(() => {
    wantsPlayRef.current = false;
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(async () => {
    if (playing) pause();
    else await play();
  }, [pause, play, playing]);

  const value = useMemo(
    () => ({
      playing,
      available,
      songTitle: eventConfig.music.title,
      toggle,
      play,
      pause,
    }),
    [playing, available, toggle, play, pause],
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return ctx;
}
