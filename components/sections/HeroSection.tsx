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
  const sectionRef       = useRef<HTMLDivElement>(null);
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const vignetteRef      = useRef<HTMLDivElement>(null);
  const textWrapRef      = useRef<HTMLDivElement>(null);
  const eyebrowRef       = useRef<HTMLDivElement>(null);
  const line1Ref         = useRef<HTMLDivElement>(null);
  const line2Ref         = useRef<HTMLDivElement>(null);
  const ctaRef           = useRef<HTMLDivElement>(null);
  const scrollHintRef    = useRef<HTMLDivElement>(null);
  const hasAnimatedRef   = useRef(false);

  // "The Science of" — first half of cross-section sentence
  const scienceRef       = useRef<HTMLDivElement>(null);
  const scienceLine1Ref  = useRef<HTMLDivElement>(null);

  // "Dominance" — second half, completes inside the hero pin
  const dominanceRevealRef = useRef<HTMLDivElement>(null);
  const dominanceTextRef   = useRef<HTMLDivElement>(null);

  // Cinematic bridge-emergence panel (rises from hero bottom)
  const bridgePanelRef = useRef<HTMLDivElement>(null);

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

      // Orange light-sweep only on desktop (GPU-intensive)
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

  // ─── Scroll-driven: frame sequence + cinematic sentence transition ───────────
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches
      || window.innerWidth < 768;

    // Mobile scrolls 3× vh, desktop 5× vh — keeps pin duration proportional to screen
    const SCROLL_MULTIPLIER = isMobile ? 3 : 5;
    const heroScrollDist    = window.innerHeight * SCROLL_MULTIPLIER;

    // Timing thresholds — mobile fires earlier so the reveal isn't cramped
    const scienceStart = isMobile ? 0.70 : 0.80;
    const scienceEnd   = isMobile ? 0.87 : 0.95;
    const panelStart   = isMobile ? 0.72 : 0.82;
    const domStart     = isMobile ? 0.80 : 0.88;
    const domEnd       = isMobile ? 0.97 : 0.99;

    const scrubBase  = isMobile ? 0.8 : 1.2;
    const panelScrub = isMobile ? 0.8 : 1.4;

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

        if (textWrapRef.current) {
          const textOpacity = p < 0.08 ? 1 : Math.max(0, 1 - (p - 0.08) * 12);
          const textY       = p > 0.08 ? -(p - 0.08) * 80 : 0;
          gsap.set(textWrapRef.current, { opacity: textOpacity, y: textY });
        }

        if (vignetteRef.current) {
          gsap.set(vignetteRef.current, { opacity: Math.min(0.85, p * 2) });
        }
      },
    });

    // ── "The Science of" — cinematic clip-path typing ──
    if (scienceRef.current && scienceLine1Ref.current) {
      const split1   = new SplitType(scienceLine1Ref.current, { types: 'chars' });
      const typingTl = gsap.timeline({ paused: true });

      typingTl.to(scienceRef.current, { opacity: 1, duration: 0.08 }, 0);
      typingTl.fromTo(
        split1.chars,
        isMobile
          ? { clipPath: 'inset(0% 105% 0% 0%)', opacity: 0, y: 10 }
          : { clipPath: 'inset(0% 105% 0% 0%)', opacity: 0, y: 16, rotateX: -25, filter: 'blur(8px)', transformOrigin: '50% 100%' },
        isMobile
          ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0, stagger: { each: 0.045, ease: 'power1.inOut' }, duration: 0.35, ease: 'power3.out' }
          : { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', stagger: { each: 0.055, ease: 'power1.inOut' }, duration: 0.4, ease: 'power3.out' },
        0.08
      );

      ScrollTrigger.create({
        trigger: section,
        start: `top+=${heroScrollDist * scienceStart} top`,
        end:   `top+=${heroScrollDist * scienceEnd}   top`,
        scrub: scrubBase,
        animation: typingTl,
      });
    }

    // ── Bridge panel rises from bottom ──
    if (bridgePanelRef.current) {
      gsap.fromTo(bridgePanelRef.current,
        { y: '100%' },
        {
          y: '0%',
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: `top+=${heroScrollDist * panelStart} top`,
            end:   `top+=${heroScrollDist * 1.0}        top`,
            scrub: panelScrub,
          },
        }
      );
    }

    // ── "Dominance" — sentence completion on the rising panel ──
    if (dominanceRevealRef.current && dominanceTextRef.current) {
      const domSplit = new SplitType(dominanceTextRef.current, { types: 'chars' });
      const domTl    = gsap.timeline({ paused: true });

      domTl.to(dominanceRevealRef.current, { opacity: 1, duration: 0.06 }, 0);
      domTl.fromTo(
        domSplit.chars,
        isMobile
          ? { clipPath: 'inset(0% 105% 0% 0%)', opacity: 0, y: 14 }
          : { clipPath: 'inset(0% 105% 0% 0%)', opacity: 0, y: 22, rotateX: -28, filter: 'blur(10px)', transformOrigin: '50% 100%' },
        isMobile
          ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0, stagger: { each: 0.055, ease: 'power1.inOut' }, duration: 0.42, ease: 'power3.out' }
          : { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', stagger: { each: 0.065, ease: 'power1.inOut' }, duration: 0.48, ease: 'power3.out' },
        0.10
      );

      ScrollTrigger.create({
        trigger: section,
        start: `top+=${heroScrollDist * domStart} top`,
        end:   `top+=${heroScrollDist * domEnd}   top`,
        scrub: scrubBase,
        animation: domTl,
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

      {/* Bottom gradient — strengthened to blend into bridge */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '40vh', background: 'linear-gradient(to top, #080808 0%, rgba(8,8,8,0.7) 35%, transparent 100%)' }} />
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
            Titan Series — 2025
          </span>
        </div>

        <div
          ref={line1Ref}
          className="font-mono text-cinema-white/90 uppercase leading-none mb-2 opacity-0"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 7.5rem)', letterSpacing: '-0.02em', transformStyle: 'preserve-3d' }}
        >
          Built for
        </div>

        <div
          ref={line2Ref}
          className="font-mono text-cinema-orange uppercase leading-none mb-10 opacity-0 overflow-visible"
          style={{ fontSize: 'clamp(3.5rem, 9.5vw, 10rem)', letterSpacing: '-0.03em', transformStyle: 'preserve-3d' }}
        >
          LEGENDS
        </div>

        <div ref={ctaRef} className="flex items-center gap-8 mt-2 opacity-0 pointer-events-auto">
          <a
            href="#collection"
            className="group relative inline-flex items-center gap-4 text-cinema-black text-[10px] font-mono tracking-ultra uppercase bg-cinema-orange px-8 py-4 overflow-hidden transition-colors duration-500 hover:bg-cinema-orange-bright"
          >
            <span className="relative z-10">Explore Collection</span>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300">
              <path d="M0 4h12M8 1l3 3-3 3" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </a>
          <a href="#story" className="text-cinema-silver/60 text-[10px] font-mono tracking-ultra uppercase hover:text-cinema-white transition-colors duration-300">
            Our Story
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 pointer-events-none"
      >
        <span className="text-cinema-silver/30 text-[9px] font-mono tracking-ultra uppercase">Scroll</span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5">
          <div className="hint-dot w-1 h-1 bg-white/60 rounded-full" />
        </div>
      </div>

      {/* ── "The Science of" — first half of cinematic sentence ── */}
      {/* Positioned in the upper portion so the rising panel reveals below it */}
      <div
        ref={scienceRef}
        className="absolute inset-x-0 flex flex-col items-center pointer-events-none"
        style={{ bottom: 'var(--hero-science-bottom)', opacity: 0, zIndex: 10 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px bg-white/15" />
          <span className="text-white/20 text-[8px] font-mono tracking-ultra uppercase">Titan X — 2025</span>
          <div className="w-6 h-px bg-white/15" />
        </div>
        <div
          ref={scienceLine1Ref}
          className="font-mono uppercase text-white/65 leading-none text-center"
          style={{
            fontSize: 'clamp(1.5rem, 3.8vw, 3.6rem)',
            letterSpacing: '0.18em',
            perspective: '600px',
            transformStyle: 'preserve-3d',
          }}
        >
          The Science of
        </div>
      </div>

      {/* ── Cinematic bridge-emergence panel ── */}
      {/* Rises from below the hero, creates physical "next section arriving" feel */}
      <div
        ref={bridgePanelRef}
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: 'var(--hero-panel-height)',
          transform: 'translateY(100%)',
          zIndex: 8,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(7,7,7,0.55) 18%, rgba(7,7,7,0.88) 40%, #070707 62%)',
        }}
      >
        {/* Atmospheric scan-line texture inside panel */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.5) 4px)',
          }}
        />
        {/* Subtle horizontal light at panel top edge */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 70%, transparent)' }}
        />
      </div>

      {/* ── "Dominance" — sentence completion on the rising panel ── */}
      <div
        ref={dominanceRevealRef}
        className="absolute inset-x-0 flex flex-col items-center pointer-events-none"
        style={{ bottom: 'var(--hero-dom-bottom)', opacity: 0, zIndex: 9 }}
      >
        {/* Connector — thin line linking "The Science of" to "Dominance" */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <div className="w-8 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div
          ref={dominanceTextRef}
          className="font-mono uppercase leading-none text-center"
          style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 5.5rem)',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.88)',
            perspective: '800px',
            transformStyle: 'preserve-3d',
            textShadow: '0 0 60px rgba(255,255,255,0.1), 0 0 120px rgba(255,255,255,0.05)',
          }}
        >
          Dominance
        </div>
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
