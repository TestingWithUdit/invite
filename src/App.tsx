import { useCallback, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CoupleIntroduction } from './components/CoupleIntroduction';
import { CountdownTimer } from './components/CountdownTimer';
import { FinalCelebration } from './components/FinalCelebration';
import { GaneshOpening } from './components/GaneshOpening';
import { InvitationDetails } from './components/InvitationDetails';
import { MusicToggle } from './components/MusicToggle';
import { RoyalEnvelope } from './components/RoyalEnvelope';
import { ScratchCard } from './components/ScratchCard';
import { useReducedMotion } from './hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const reduced = useReducedMotion();
  const [showStory, setShowStory] = useState(false);

  const begin = useCallback(() => {
    setShowStory(true);
    requestAnimationFrame(() => {
      document.getElementById('royal-envelope')?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }, [reduced]);

  const onEnvelopeOpened = useCallback(() => {
    requestAnimationFrame(() => {
      document.getElementById('meet-the-couple')?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }, [reduced]);

  useEffect(() => {
    if (reduced || !showStory) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils
        .toArray<HTMLElement>('section [data-reveal]')
        .filter((el) => !!el);
      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: targets[0]?.closest('section') ?? undefined,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        },
      );
    });

    return () => ctx.revert();
  }, [reduced, showStory]);

  return (
    <div className="overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[var(--color-ivory)] focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <main id="main">
        <GaneshOpening onBegin={begin} />

        {showStory && (
          <>
            {/* Full invitation story — all sections stay visible for scrolling */}
            <RoyalEnvelope onOpened={onEnvelopeOpened} />
            <CoupleIntroduction />
            <ScratchCard />
            <InvitationDetails visible />
            <CountdownTimer />
            <FinalCelebration />
          </>
        )}
      </main>

      <MusicToggle />
    </div>
  );
}
