import { useEffect, useState } from 'react';
import { getEventStartUtc } from '../config/event';

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};

function compute(target: Date): CountdownParts {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, isComplete: false };
}

export function useCountdown(targetDate: Date = getEventStartUtc()): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() => compute(targetDate));

  useEffect(() => {
    setParts(compute(targetDate));
    const id = window.setInterval(() => {
      const next = compute(targetDate);
      setParts(next);
      if (next.isComplete) {
        window.clearInterval(id);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [targetDate]);

  return parts;
}
