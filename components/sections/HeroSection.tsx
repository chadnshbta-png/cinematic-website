'use client';

import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useFrameSequence } from '@/hooks/useFrameSequence';
import SplitType from 'split-type';

interface HeroSectionProps {
  onLoadProgress: (progress: number) => void;
  onLoadComplete: () => void;
}

export default function HeroSection({ onLoadProgress, onLoadComplete }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  // Cinematic typing phrase — "The Science of" (continues as "Dominance" in next section)
  const scienceRef      = useRef<HTMLDivElement>(null);
  const scienceLine1Ref = useRef<HTMLDivElement>(null);

  const { setProgress, state } = useFrameSequence(canvasRef);

  // Notify parent of load progress
  useEffect(() => {
    onLoadProgress(state.progress * 100);
    if (state.isReady && !hasAnimatedRef.current) {
      onLoadComplete();
      hasAnimatedRef.current = true;
    }
  }, [state.progress, state.isReady, onLoadProgress, onLoadComplete]);

  // 3D Writing entrance animation — fires once frames are ready
  useEffect(() => {
    if (!state.isReady) return;

    const tl = gsap.timeline({ delay: 0.6 });

    // --- Eyebrow ---
    if (eyebrowRef.current) {
      const eyeSplit = new SplitType(eyebrowRef.current, { types: 'chars' });
      tl.fromTo(
        eyeSplit.chars,
        { opacity: 0, x: -20, filter: 'blur(4px)' },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: 0.04,
          ease: 'power3.out',
        },
        0
      );
    }

    // --- Line 1: "Built for" — letters tumble in from depth ---
    if (line1Ref.current) {
      const s1 = new SplitType(line1Ref.current, { types: 'chars', tagName: 'span' });
      gsap.set(line1Ref.current, { perspective: 800 });
      tl.fromTo(
        s1.chars,
        {
          opacity: 0,
          rotateX: -90,
          y: 60,
          z: -120,
          filter: 'blur(10px)',
          transformOrigin: '50% 100% -40px',
        },
        {
          opacity: 1,
          rotateX: 0,
          y: 0,
          z: 0,
          filter: 'blur(0px)',
          duration: 1.4,
          stagger: { each: 0.06, ease: 'power2.in' },
          ease: 'power4.out',
        },
        0.2
      );
    }

    // --- Line 2: "LEGENDS" — dramatic reveal with horizontal write ---
    if (line2Ref.current) {
      const s2 = new SplitType(line2Ref.current, { types: 'chars', tagName: 'span' });
      gsap.set(line2Ref.current, { perspective: 1000 });

      // Each char comes from a different z-depth sequentially
      tl.fromTo(
        s2.chars,
        {
          opacity: 0,
          rotateX: -60,
          rotateY: 20,
          x: (i) => -(i + 1) * 8,
          z: (i) => -(i + 1) * 40,
          filter: 'blur(16px)',
          transformOrigin: '0% 50% -80px',
        },
        {
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          x: 0,
          z: 0,
          filter: 'blur(0px)',
          duration: 1.8,
          stagger: { each: 0.08, ease: 'power3.in' },
          ease: 'expo.out',
        },
        0.6
      );

      // Orange writing light sweep across "LEGENDS"
      const sweep = document.createElement('div');
      sweep.className = 'absolute inset-0 pointer-events-none';
      sweep.style.cssText = `
        background: linear-gradient(90deg, transparent 0%, rgba(232,98,42,0.4) 40%, rgba(232,98,42,0.6) 50%, rgba(232,98,42,0.4) 60%, transparent 100%);
        mix-blend-mode: screen;
        transform: translateX(-100%);
      `;
      line2Ref.current.style.position = 'relative';
      line2Ref.current.appendChild(sweep);

      tl.fromTo(
        sweep,
        { x: '-100%' },
        { x: '200%', duration: 1.2, ease: 'power2.inOut' },
        0.7
      );

      // Cleanup sweep after animation
      tl.add(() => {
        if (sweep.parentNode) sweep.parentNode.removeChild(sweep);
      }, '+=0.1');
    }

    // --- CTA ---
    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 25, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' },
        1.8
      );
    }

    // --- Scroll hint ---
    if (scrollHintRef.current) {
      tl.fromTo(
        scrollHintRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7 },
        2.0
      );

      gsap.to(scrollHintRef.current.querySelector('.hint-dot'), {
        y: 14,
        duration: 1.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2.5,
      });
    }
  }, [state.isReady]);

  // Scroll-driven: frame sequence + text exit + transition label
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const SCROLL_MULTIPLIER = 5; // 5× viewport scroll distance

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${window.innerHeight * SCROLL_MULTIPLIER}`,
      pin: true,
      pinSpacing: true,
      scrub: false, // We control lerp ourselves
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Feed smooth progress to lerp-based frame renderer
        setProgress(self.progress);

        const p = self.progress;

        // Text wrap: fade + lift as scroll begins
        if (textWrapRef.current) {
          const textOpacity = p < 0.08 ? 1 : Math.max(0, 1 - (p - 0.08) * 12);
          const textY = p > 0.08 ? -(p - 0.08) * 80 : 0;
          gsap.set(textWrapRef.current, { opacity: textOpacity, y: textY });
        }

        // Vignette pulses in as truck enters
        if (vignetteRef.current) {
          const vigOpacity = Math.min(0.85, p * 2);
          gsap.set(vignetteRef.current, { opacity: vigOpacity });
        }
      },
    });

    // ── "The Science of" — cinematic clip-path typing at hero end ──
    // "Dominance" continues in the bridge section below.
    const heroScrollDist = window.innerHeight * SCROLL_MULTIPLIER;
    const line1El  = scienceLine1Ref.current;
    const scienceEl = scienceRef.current;

    if (scienceEl && line1El) {
      const split1 = new SplitType(line1El, { types: 'chars' });

      const typingTl = gsap.timeline({ paused: true });

      // Wrapper fades in
      typingTl.to(scienceEl, { opacity: 1, duration: 0.1 }, 0);

      // Each char: clip-path wipe left-to-right + rise from below + deblur
      typingTl.fromTo(
        split1.chars,
        {
          clipPath: 'inset(0% 105% 0% 0%)',
          opacity: 0,
          y: 16,
          rotateX: -25,
          filter: 'blur(8px)',
          transformOrigin: '50% 100%',
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          stagger: { each: 0.055, ease: 'power1.inOut' },
          duration: 0.4,
          ease: 'power3.out',
        },
        0.08
      );

      ScrollTrigger.create({
        trigger: section,
        start: `top+=${heroScrollDist * 0.80} top`,
        end:   `top+=${heroScrollDist * 0.97} top`,
        scrub: 1.2,
        animation: typingTl,
      });
    }

    return () => st.kill();
  }, [setProgress]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen bg-cinema-black overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Frame sequence canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          width: '100%',
          height: '100%',
          willChange: 'contents',
          imageRendering: 'auto',
        }}
      />

      {/* Vignette — deepens as sequence progresses */}
      <div
        ref={vignetteRef}
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 15%, rgba(8,8,8,0.5) 55%, rgba(8,8,8,0.97) 100%)',
          willChange: 'opacity',
        }}
      />

      {/* Bottom gradient for smooth transition out */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-cinema-black to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cinema-black/70 to-transparent pointer-events-none" />

      {/* Side vignettes for cinematic aspect */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cinema-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-cinema-black/60 to-transparent pointer-events-none" />

      {/* Letterbox bars */}
      <div className="absolute top-0 inset-x-0 h-10 bg-cinema-black pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-10 bg-cinema-black pointer-events-none" />

      {/* =================== HERO TEXT — 3D WRITE-IN =================== */}
      <div
        ref={textWrapRef}
        className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 pointer-events-none"
        style={{ willChange: 'opacity, transform' }}
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="flex items-center gap-4 mb-6 opacity-0"
        >
          <div className="w-6 h-px bg-cinema-orange" />
          <span className="text-cinema-orange text-[10px] font-mono tracking-ultra uppercase">
            Titan Series — 2025
          </span>
        </div>

        {/* Line 1: "Built for" */}
        <div
          ref={line1Ref}
          className="font-mono text-cinema-white/90 uppercase leading-none mb-2 opacity-0"
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 7.5rem)',
            letterSpacing: '-0.02em',
            transformStyle: 'preserve-3d',
          }}
        >
          Built for
        </div>

        {/* Line 2: "LEGENDS" — big orange word */}
        <div
          ref={line2Ref}
          className="font-mono text-cinema-orange uppercase leading-none mb-10 opacity-0 overflow-visible"
          style={{
            fontSize: 'clamp(3.5rem, 9.5vw, 10rem)',
            letterSpacing: '-0.03em',
            transformStyle: 'preserve-3d',
          }}
        >
          LEGENDS
        </div>

        {/* CTA group */}
        <div ref={ctaRef} className="flex items-center gap-8 mt-2 opacity-0 pointer-events-auto">
          <a
            href="#collection"
            className="group relative inline-flex items-center gap-4 text-cinema-black text-[10px] font-mono tracking-ultra uppercase bg-cinema-orange px-8 py-4 overflow-hidden transition-colors duration-500 hover:bg-cinema-orange-bright"
          >
            <span className="relative z-10">Explore Collection</span>
            <svg
              width="14"
              height="8"
              viewBox="0 0 14 8"
              fill="none"
              className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300"
            >
              <path d="M0 4h12M8 1l3 3-3 3" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </a>

          <a
            href="#story"
            className="text-cinema-silver/60 text-[10px] font-mono tracking-ultra uppercase hover:text-cinema-white transition-colors duration-300"
          >
            Our Story
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 pointer-events-none"
      >
        <span className="text-cinema-silver/30 text-[9px] font-mono tracking-ultra uppercase">
          Scroll
        </span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5">
          <div className="hint-dot w-1 h-1 bg-white/60 rounded-full" />
        </div>
      </div>

      {/* "The Science of" — cinematic typing phrase, bottom-center of hero */}
      <div
        ref={scienceRef}
        className="absolute inset-x-0 flex flex-col items-center pointer-events-none"
        style={{ bottom: '22%', opacity: 0 }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-6 h-px bg-white/15" />
          <span className="text-white/18 text-[8px] font-mono tracking-ultra uppercase">Titan X — 2025</span>
          <div className="w-6 h-px bg-white/15" />
        </div>
        <div
          ref={scienceLine1Ref}
          className="font-mono uppercase text-white/70 leading-none text-center"
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 3.8rem)',
            letterSpacing: '0.18em',
            perspective: '600px',
            transformStyle: 'preserve-3d',
          }}
        >
          The Science of
        </div>
        {/* Trailing cursor — blinks while "Dominance" waits in next section */}
        <div
          className="w-px mt-3 bg-white/30"
          style={{ height: 'clamp(1.2rem, 2.5vw, 2.2rem)', animation: 'glowPulse 1.1s ease-in-out infinite' }}
        />
      </div>

      {/* Atmospheric particles — monochrome silver glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${180 + i * 90}px`,
              height: `${180 + i * 90}px`,
              background: 'rgba(255,255,255,1)',
              left: `${[5, 75, 40, 15, 85][i]}%`,
              top: `${[30, 20, 70, 80, 55][i]}%`,
              opacity: 0.012 + i * 0.004,
              animation: `particleFloat ${9 + i * 2.5}s ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
