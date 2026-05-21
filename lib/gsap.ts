'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { TextPlugin } from 'gsap/TextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin);

  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  });

  gsap.config({
    nullTargetWarn: false,
    
  });

  gsap.defaults({
    ease: 'power3.out',
    duration: 1,
  });
}

export { gsap, ScrollTrigger, MotionPathPlugin, TextPlugin };
