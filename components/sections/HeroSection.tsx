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
  const sectionRef     = useRef<HTMLDivElement>(null);
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const vignetteRef    = useRef<HTMLDivElement>(null);
  const textWrapRef    = useRef<HTMLDivElement>(null);
  const eyebrowRef     = useRef<HTMLDivElement>(null);
  const line1Ref       = useRef<HTMLDivElement>(null);
  const line2Ref       = useRef<HTMLDivElement>(null);
  const ctaRef         = useRef<HTMLDivElement>(null);
  const scrollHintRef  = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  // Cinematic title — emerges inside hero from frames 365→480
  const cinematicTitleRef = useRef<HTMLDivElement>(null);
  const titleAccentRef    = useRef<HTMLDivElement>(null);
  const titleEyebrowRef   = useRef<HTMLDivElement>(null);
  const titleLine1Ref     = useRef<HTMLDivElement>(null);
  const titleLine2Ref     = useRef<HTMLDivElement>(null);

  const { setProgress, state } = useFrameSequence(canvasRef);

  useEffect(() => {
    onLoadProgress(state.progress * 100);
    if (state.isReady && !hasAnimatedRef.current) {
      onLoadComplete();
      hasAnimatedRef.current = true;
    }
  }, [state.progress, state.isReady, onLoadProgress, onLoadComplete]);

  // 3D write-in entrance — fires once frames are ready
  useEffect(() => {
    if (!state.isReady) return;

    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches
      || window.innerWidth < 768;

    const tl = gsap.timeline({ delay: isMobile ? 0.4 : 0.6 });

    if (eyebrowRef.current) {
      const eyeSplit = new SplitType(eyebrowRef.current, { types: 'chars' });
      tl.fromTo(
        eyeSplit.chars,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.04, ease: 'power3.out' },
        0
      );
    }

    if (line1Ref.current) {
      const s1 = new SplitType(line1Ref.current, { types: 'chars', tagName: 'span' });
      if (!isMobile) gsap.set(line1Ref.current, { perspective: 800 });
      tl.fromTo(
        s1.chars,
        isMobile
          ? { opacity: 0, y: 30 }
          : { opacity: 0, rotateX: -90, y: 60, z: -120, filter: 'blur(10px)', transformOrigin: '50% 100% -40px' },
        isMobile
          ? { opacity: 1, y: 0, duration: 1.0, stagger: { each: 0.04, ease: 'power2.in' }, ease: 'power3.out' }
          : { opacity: 1, rotateX: 0, y: 0, z: 0, filter: 'blur(0px)', duration: 1.4, stagger: { each: 0.06, ease: 'power2.in' }, ease: 'power4.out' },
        0.2
      );
    }

    if (line2Ref.current) {
      const s2 = new SplitType(line2Ref.current, { types: 'chars', tagName: 'span' });
      if (!isMobile) gsap.set(line2Ref.current, { perspective: 1000 });

      tl.fromTo(
        s2.chars,
        isMobile
          ? { opacity: 0, y: 40 }
          : { opacity: 0, rotateX: -60, rotateY: 20, x: (i) => -(i + 1) * 8, z: (i) => -(i + 1) * 40, filter: 'blur(16px)', transformOrigin: '0% 50% -80px' },
        isMobile
          ? { opacity: 1, y: 0, duration: 1.2, stagger: { each: 0.055, ease: 'power2.in' }, ease: 'power3.out' }
          : { opacity: 1, rotateX: 0, rotateY: 0, x: 0, z: 0, filter: 'blur(0px)', duration: 1.8, stagger: { each: 0.08, ease: 'power3.in' }, ease: 'expo.out' },
        0.6
      );

      // Orange light-sweep — desktop only (GPU-intensive)
      if (!isMobile) {
        const sweep = document.createElement('div');
        sweep.className = 'absolute inset-0 pointer-events-none';
        sweep.style.cssText = `
          background: linear-gradient(90deg, transparent 0%, rgba(232,98,42,0.4) 40%, rgba(232,98,42,0.6) 50%, rgba(232,98,42,0.4) 60%, transparent 100%);
          mix-blend-mode: screen;
          transform: translateX(-100%);
        `;
        line2Ref.current.style.position = 'relative';
        line2Ref.current.appendChild(sweep);
        tl.fromTo(sweep, { x: '-100%' }, { x: '200%', duration: 1.2, ease: 'power2.inOut' }, 0.7);
        tl.add(() => { if (sweep.parentNode) sweep.parentNode.removeChild(sweep); }, '+=0.1');
      }
    }

    if (ctaRef.current) {
      tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, isMobile ? 1.4 : 1.8);
    }

    if (scrollHintRef.current) {
      tl.fromTo(scrollHintRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, isMobile ? 1.6 : 2.0);

      gsap.to(scrollHintRef.current.querySelector('.hint-dot'), {
        y: 14, duration: 1.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: isMobile ? 2.0 : 2.5,
      });
    }
  }, [state.isReady]);

  // ─── Scroll-driven: frame sequence + cinematic title reveal ──────────────
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches
      || window.innerWidth < 768;

    const SCROLL_MULTIPLIER = isMobile ? 3 : 5;
    const heroScrollDist    = window.innerHeight * SCROLL_MULTIPLIER;

    // Frame 365 out of 480 — where the cinematic title begins to emerge
    const TEXT_START = 365 / 480;

    // ── Build the cinematic title reveal timeline (paused, scrubbed by scroll) ──
    let cinematicTl: gsap.core.Timeline | null = null;

    if (cinematicTitleRef.current && titleLine1Ref.current && titleLine2Ref.current) {
      const split1 = new SplitType(titleLine1Ref.current, { types: 'chars' });
      const split2 = new SplitType(titleLine2Ref.current, { types: 'chars' });

      if (!isMobile) {
        gsap.set(titleLine2Ref.current, { perspective: 900, transformStyle: 'preserve-3d' });
      }

      cinematicTl = gsap.timeline({ paused: true });

      // Container becomes visible
      cinematicTl.to(cinematicTitleRef.current, { opacity: 1, duration: 0.04 }, 0);

      // Accent line wipes in from center
      if (titleAccentRef.current) {
        cinematicTl.fromTo(
          titleAccentRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.18, ease: 'power2.out', transformOrigin: 'center' },
          0.02
        );
      }

      // Eyebrow label slides up into place
      if (titleEyebrowRef.current) {
        cinematicTl.fromTo(
          titleEyebrowRef.current,
          { opacity: 0, y: 8, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.22, ease: 'power2.out' },
          0.08
        );
      }

      // Line 1 — tracking compresses inward as text settles
      cinematicTl.fromTo(
        titleLine1Ref.current,
        { letterSpacing: '0.42em' },
        { letterSpacing: '0.22em', duration: 0.55, ease: 'power2.out' },
        0.12
      );

      // Line 1 chars — blur-to-focus, clip-path wipe left→right, staggered
      cinematicTl.fromTo(
        split1.chars,
        {
          opacity: 0,
          filter: 'blur(8px)',
          y: isMobile ? 8 : 12,
          clipPath: 'inset(0% 100% 0% 0%)',
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          stagger: { each: 0.038, ease: 'power1.inOut' },
          duration: 0.35,
          ease: 'power3.out',
        },
        0.12
      );

      // Line 2 — tracking compresses harder (bigger type, more dramatic)
      cinematicTl.fromTo(
        titleLine2Ref.current,
        { letterSpacing: '0.34em' },
        { letterSpacing: '0.14em', duration: 0.65, ease: 'power2.out' },
        0.40
      );

      // Line 2 chars — deeper blur, subtle 3D rotateX on desktop
      cinematicTl.fromTo(
        split2.chars,
        isMobile
          ? { opacity: 0, filter: 'blur(10px)', y: 16, clipPath: 'inset(0% 100% 0% 0%)' }
          : { opacity: 0, filter: 'blur(18px)', y: 22, clipPath: 'inset(0% 100% 0% 0%)', rotateX: -18, transformOrigin: '50% 100%' },
        isMobile
          ? {
              opacity: 1, filter: 'blur(0px)', y: 0, clipPath: 'inset(0% 0% 0% 0%)',
              stagger: { each: 0.05, ease: 'power1.inOut' },
              duration: 0.42,
              ease: 'power3.out',
            }
          : {
              opacity: 1, filter: 'blur(0px)', y: 0, clipPath: 'inset(0% 0% 0% 0%)', rotateX: 0,
              stagger: { each: 0.055, ease: 'power1.inOut' },
              duration: 0.50,
              ease: 'power4.out',
            },
        0.40
      );
    }

    // ── Main pin + frame scrub ──
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${heroScrollDist}`,
      pin: true,
      pinSpacing: true,
      scrub: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setProgress(self.progress);
        const p = self.progress;

        // Entrance text fades out and lifts as scroll begins
        if (textWrapRef.current) {
          const textOpacity = p < 0.08 ? 1 : Math.max(0, 1 - (p - 0.08) * 12);
          const textY       = p > 0.08 ? -(p - 0.08) * 80 : 0;
          gsap.set(textWrapRef.current, { opacity: textOpacity, y: textY });
        }

        // Vignette deepens with scroll
        if (vignetteRef.current) {
          gsap.set(vignetteRef.current, { opacity: Math.min(0.85, p * 2) });
        }

        // Cinematic title — scrub progress mapped from frame 365→480
        if (cinematicTl) {
          const textProg = Math.max(0, Math.min(1, (p - TEXT_START) / (1 - TEXT_START)));
          cinematicTl.progress(textProg);
        }
      },
    });

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
        style={{ width: '100%', height: '100%', willChange: 'contents', imageRendering: 'auto' }}
      />

      {/* Vignette */}
      <div
        ref={vignetteRef}
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 15%, rgba(8,8,8,0.5) 55%, rgba(8,8,8,0.97) 100%)',
          willChange: 'opacity',
        }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '40vh', background: 'linear-gradient(to top, #080808 0%, rgba(8,8,8,0.7) 35%, transparent 100%)' }}
      />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cinema-black/70 to-transparent pointer-events-none" />

      {/* Side vignettes */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cinema-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-cinema-black/60 to-transparent pointer-events-none" />

      {/* Letterbox bars */}
      <div className="absolute top-0 inset-x-0 h-10 bg-cinema-black pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-10 bg-cinema-black pointer-events-none" />

      {/* ── "Built for LEGENDS" entrance text ── */}
      <div
        ref={textWrapRef}
        className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 pointer-events-none"
        style={{ willChange: 'opacity, transform' }}
      >
        <div ref={eyebrowRef} className="flex items-center gap-4 mb-6 opacity-0">
          <div className="w-6 h-px bg-cinema-orange" />
          <span className="text-cinema-orange text-[10px] font-mono tracking-ultra uppercase">
            DSV Series — 2025
          </span>
        </div>

        <div
          ref={line1Ref}
          className="font-mono text-cinema-white/90 uppercase leading-none mb-2 opacity-0"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 7.5rem)', letterSpacing: '-0.02em', transformStyle: 'preserve-3d' }}
        >
          Moving the
        </div>

        <div
          ref={line2Ref}
          className="font-mono text-cinema-orange uppercase leading-none mb-10 opacity-0 overflow-visible"
          style={{ fontSize: 'clamp(3.5rem, 9.5vw, 10rem)', letterSpacing: '-0.03em', transformStyle: 'preserve-3d' }}
        >
          WORLD
        </div>

        <div ref={ctaRef} className="flex items-center gap-8 mt-2 opacity-0 pointer-events-auto">
          <a
            href="#collection"
            className="group relative inline-flex items-center gap-4 text-cinema-black text-[10px] font-mono tracking-ultra uppercase bg-cinema-orange px-8 py-4 overflow-hidden transition-colors duration-500 hover:bg-cinema-orange-bright"
          >
            <span className="relative z-10">Explore Network</span>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300">
              <path d="M0 4h12M8 1l3 3-3 3" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </a>
          <a href="#story" className="text-cinema-silver/60 text-[10px] font-mono tracking-ultra uppercase hover:text-cinema-white transition-colors duration-300">
            Our Network
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 pointer-events-none"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <span className="text-cinema-silver/30 text-[9px] font-mono tracking-ultra uppercase">Scroll</span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5">
          <div className="hint-dot w-1 h-1 bg-white/60 rounded-full" />
        </div>
      </div>

      {/* ── Cinematic title — reveals inside hero, frames 365→480 ── */}
      <div
        ref={cinematicTitleRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-5 md:px-0 pointer-events-none"
        style={{ opacity: 0, zIndex: 12 }}
      >
        {/* Horizontal accent line */}
        <div
          ref={titleAccentRef}
          style={{
            width: 'clamp(56px, 7vw, 96px)',
            height: '1px',
            marginBottom: 'clamp(20px, 3vh, 32px)',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'scaleX(0)',
            opacity: 0,
          }}
        />

        {/* Eyebrow label */}
        <div
          ref={titleEyebrowRef}
          className="flex items-center gap-3"
          style={{ marginBottom: 'clamp(18px, 2.5vh, 28px)', opacity: 0 }}
        >
          <div style={{ width: '16px', height: '1px', background: 'rgba(255,255,255,0.16)' }} />
          <span
            className="font-mono uppercase"
            style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.24em' }}
          >
            DSV X — 2025
          </span>
          <div style={{ width: '16px', height: '1px', background: 'rgba(255,255,255,0.16)' }} />
        </div>

        {/* Line 1: "The Science of" */}
        <div
          ref={titleLine1Ref}
          className="font-mono uppercase text-center leading-none"
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.48)',
            marginBottom: 'clamp(8px, 1.2vh, 16px)',
          }}
        >
          The Science of
        </div>

        {/* Line 2: "Dominance" */}
        <div
          ref={titleLine2Ref}
          className="font-mono uppercase text-center leading-none"
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 5rem)',
            letterSpacing: '0.14em',
            color: 'rgba(255,255,255,0.92)',
            textShadow: '0 0 80px rgba(255,255,255,0.1), 0 0 160px rgba(255,255,255,0.05)',
          }}
        >
          Dominance
        </div>

        {/* Bottom accent */}
        <div
          style={{
            width: 'clamp(28px, 3.5vw, 44px)',
            height: '1px',
            marginTop: 'clamp(20px, 3vh, 32px)',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
      </div>

      {/* Atmospheric particles */}
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
              top:  `${[30, 20, 70, 80, 55][i]}%`,
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
