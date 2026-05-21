'use client';

import SplitType from 'split-type';
import { gsap } from '@/lib/gsap';

export interface SplitRevealOptions {
  types?: 'lines' | 'words' | 'chars' | 'lines,words,chars';
  duration?: number;
  stagger?: number;
  ease?: string;
  y?: number;
  delay?: number;
  onComplete?: () => void;
}

export function splitReveal(
  element: Element | string,
  options: SplitRevealOptions = {}
): { tl: gsap.core.Timeline; split: SplitType } {
  const {
    types = 'chars',
    duration = 1.0,
    stagger = 0.025,
    ease = 'power3.out',
    y = 100,
    delay = 0,
    onComplete,
  } = options;

  const split = new SplitType(element as HTMLElement, {
    types: types as 'lines' | 'words' | 'chars',
    tagName: 'span',
  });

  const targets = (() => {
    if (types.includes('chars')) return split.chars;
    if (types.includes('words')) return split.words;
    return split.lines;
  })();

  gsap.set(targets, { overflow: 'hidden' });

  const tl = gsap.timeline({ delay, onComplete });

  tl.fromTo(
    targets,
    {
      y,
      opacity: 0,
      rotateX: -30,
    },
    {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration,
      stagger,
      ease,
    }
  );

  return { tl, split };
}

export function splitKineticReveal(
  element: Element | string,
  options: SplitRevealOptions = {}
): { tl: gsap.core.Timeline; split: SplitType } {
  const split = new SplitType(element as HTMLElement, {
    types: 'chars',
    tagName: 'span',
  });

  const chars = split.chars || [];

  const tl = gsap.timeline({ delay: options.delay ?? 0 });

  tl.fromTo(
    chars,
    { y: 80, opacity: 0, scaleY: 1.5, transformOrigin: 'bottom center' },
    {
      y: 0,
      opacity: 1,
      scaleY: 1,
      duration: options.duration ?? 1.2,
      stagger: options.stagger ?? 0.04,
      ease: 'back.out(1.4)',
    }
  );

  return { tl, split };
}

export function createWordReveal(
  container: Element,
  options: SplitRevealOptions = {}
): gsap.core.Timeline {
  const split = new SplitType(container as HTMLElement, {
    types: 'words',
    tagName: 'span',
  });

  const words = split.words || [];

  const tl = gsap.timeline({ paused: true });
  tl.fromTo(
    words,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: options.duration ?? 0.8,
      stagger: options.stagger ?? 0.08,
      ease: options.ease ?? 'power2.out',
    }
  );

  return tl;
}

export function createLineReveal(
  container: Element,
  options: SplitRevealOptions = {}
): gsap.core.Timeline {
  const split = new SplitType(container as HTMLElement, {
    types: 'lines',
    tagName: 'span',
  });

  const lines = split.lines || [];

  const tl = gsap.timeline({ paused: true });
  tl.fromTo(
    lines,
    { clipPath: 'inset(0 0 100% 0)', y: 20 },
    {
      clipPath: 'inset(0 0 0% 0)',
      y: 0,
      duration: options.duration ?? 1.0,
      stagger: options.stagger ?? 0.15,
      ease: options.ease ?? 'power3.out',
    }
  );

  return tl;
}
