'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const vel = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let raf: number;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'none' });
    };

    const animate = () => {
      vel.current.x += (pos.current.x - vel.current.x) * 0.12;
      vel.current.y += (pos.current.y - vel.current.y) * 0.12;
      gsap.set(cursor, { x: vel.current.x, y: vel.current.y });
      raf = requestAnimationFrame(animate);
    };

    const onHover = () => {
      gsap.to(cursor, { scale: 2, borderColor: 'rgba(255,255,255,0.9)', duration: 0.3 });
    };

    const onLeave = () => {
      gsap.to(cursor, { scale: 1, borderColor: 'rgba(255,255,255,0.5)', duration: 0.3 });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    const interactives = document.querySelectorAll('a, button, [data-cursor]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onHover);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onHover);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white/50 rounded-full pointer-events-none z-[9998] mix-blend-exclusion"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[9998]"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}
