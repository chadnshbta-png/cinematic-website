'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export interface ParallaxLayer {
  element: Element | null;
  depth: number;
  maxOffset?: number;
}

export function useMouseParallax(layers: ParallaxLayer[]) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    const animate = () => {
      currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * 0.05;
      currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * 0.05;

      layers.forEach(({ element, depth, maxOffset = 40 }) => {
        if (!element) return;
        const x = currentRef.current.x * depth * maxOffset;
        const y = currentRef.current.y * depth * maxOffset;
        gsap.set(element, { x, y });
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [layers]);
}

export function useScrollParallax(
  containerRef: React.RefObject<Element>,
  options: { speed?: number; direction?: 'up' | 'down' } = {}
) {
  const { speed = 0.5, direction = 'up' } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self: { progress: number }) => {
        const y = self.progress * window.innerHeight * speed * (direction === 'up' ? -1 : 1);
        gsap.set(container, { y });
      },
    });

    return () => st.kill();
  }, [containerRef, speed, direction]);
}
