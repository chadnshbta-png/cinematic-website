'use client';

import { gsap } from '@/lib/gsap';

export const cinemaEase = 'power4.inOut';
export const smoothEase = 'power2.out';
export const elasticEase = 'elastic.out(1, 0.5)';
export const entranceEase = 'power3.out';

export const defaultDurations = {
  instant: 0.15,
  fast: 0.4,
  medium: 0.8,
  slow: 1.2,
  cinematic: 2.0,
  epic: 3.5,
} as const;

export function createRevealTimeline(elements: Element[], options?: gsap.TimelineVars) {
  const tl = gsap.timeline({ paused: true, ...options });

  tl.fromTo(
    elements,
    { y: 60, opacity: 0, filter: 'blur(4px)' },
    {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: defaultDurations.medium,
      stagger: 0.12,
      ease: entranceEase,
    }
  );

  return tl;
}

export function createMaskReveal(element: Element, options?: gsap.TweenVars) {
  return gsap.fromTo(
    element,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: defaultDurations.slow,
      ease: cinemaEase,
      ...options,
    }
  );
}

export function createScaleReveal(element: Element, options?: gsap.TweenVars) {
  return gsap.fromTo(
    element,
    { scale: 1.15, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: defaultDurations.cinematic,
      ease: smoothEase,
      ...options,
    }
  );
}

export function killAllScrollTriggers(): void {
  import('@/lib/gsap').then(({ ScrollTrigger }) => {
    ScrollTrigger.getAll().forEach((st: { kill: () => void }) => st.kill());
  });
}
