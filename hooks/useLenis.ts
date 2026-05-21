'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from '@/lib/gsap';
import { gsap } from '@/lib/gsap';

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useLenis(): { lenis: Lenis | null } {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisInstance = lenis;
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisInstance = null;
      lenisRef.current = null;
    };
  }, []);

  return { lenis: lenisRef.current };
}
