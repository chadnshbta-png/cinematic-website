'use client';

import { useRef, useLayoutEffect } from 'react';
import { gsap } from '@/lib/gsap';

export default function YOSSection() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLDivElement>(null);
  const tosRef       = useRef<HTMLDivElement>(null);
  const subRef       = useRef<HTMLDivElement>(null);
  const bgRef        = useRef<HTMLDivElement>(null);

  // Word element refs
  const w0Ref = useRef<HTMLSpanElement>(null);
  const w1Ref = useRef<HTMLSpanElement>(null);
  const w2Ref = useRef<HTMLSpanElement>(null);
  const r0Ref = useRef<HTMLSpanElement>(null);
  const r1Ref = useRef<HTMLSpanElement>(null);
  const r2Ref = useRef<HTMLSpanElement>(null);
  const dot0Ref = useRef<HTMLSpanElement>(null);
  const dot1Ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const tos     = tosRef.current;
    const title   = titleRef.current;
    const sub     = subRef.current;
    const bg      = bgRef.current;
    if (!section || !tos || !title || !sub || !bg) return;

    // Lock both title and TOS to exact viewport center independently
    // TOS already has top:50% left:50% transform:-50%,-50%
    // Title is in a flex-center container — both always centered

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=320%',
        pin: true,
        pinSpacing: true,
        scrub: 1.0,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // 0 → 0.12 — title fades in from blur
    tl.fromTo(title,
      { opacity: 0, scale: 0.92, filter: 'blur(16px)' },
      { opacity: 1, scale: 1,    filter: 'blur(0px)', duration: 0.12, ease: 'power2.out' },
      0
    );

    // 0.10 → 0.15 — bg glow warms
    tl.to(bg, { opacity: 0.15, duration: 0.1 }, 0.08);

    // 0.35 → 0.55 — "rest" spans shrink (ITAN, PERATING, YSTEM)
    tl.to([r0Ref.current, r1Ref.current, r2Ref.current], {
      opacity: 0,
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.18,
      stagger: 0.04,
      ease: 'power3.in',
    }, 0.33);

    // Separator dots fade
    tl.to([dot0Ref.current, dot1Ref.current], {
      opacity: 0,
      scale: 0.2,
      duration: 0.1,
      stagger: 0.03,
    }, 0.36);

    // Letter spacing of words collapses
    tl.to([w0Ref.current, w1Ref.current, w2Ref.current], {
      letterSpacing: '-0.06em',
      duration: 0.18,
      stagger: 0.04,
      ease: 'power2.in',
    }, 0.36);

    // 0.55 → 0.70 — title spreads letter spacing then fades
    tl.to(title, {
      letterSpacing: '0.4em',
      duration: 0.14,
      ease: 'expo.out',
    }, 0.54);

    tl.to(title, {
      opacity: 0,
      scale: 0.75,
      filter: 'blur(10px)',
      duration: 0.12,
      ease: 'power2.in',
    }, 0.71);

    // 0.78 → 1.0 — TOS emerges: scale from 1.8 → 1, letter-spacing collapses
    tl.fromTo(tos,
      {
        opacity: 0,
        scale: 1.75,
        filter: 'blur(30px)',
        letterSpacing: '0.65em',
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        letterSpacing: '0.12em',
        duration: 0.24,
        ease: 'expo.out',
      },
      0.77
    );

    // Subline appears
    tl.fromTo(sub,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
      0.93
    );

    // bg glow reaches peak
    tl.to(bg, { opacity: 0.25, scale: 1.5, duration: 0.25 }, 0.77);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-cinema-black overflow-hidden"
    >
      {/* ── Monochrome atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="tos-grid2" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M60 0L0 0 0 60" fill="none" stroke="white" strokeWidth="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tos-grid2)"/>
          </svg>
        </div>

        {/* Central white glow */}
        <div
          ref={bgRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-2xl max-h-2xl rounded-full opacity-0"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)',
          }}
        />

        {/* Orbit rings — monochrome */}
        {[160, 240, 320].map((r, i) => (
          <div
            key={r}
            className="absolute top-1/2 left-1/2 rounded-full border border-white/[0.04]"
            style={{
              width: r * 2, height: r * 2,
              marginLeft: -r, marginTop: -r,
              animation: `spinOrbit ${30 + i * 12}s linear infinite ${i % 2 ? 'reverse' : ''}`,
            }}
          />
        ))}

        {/* Cross-hairs */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.04]" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.04]" />
      </div>

      {/* ── Pinned content ── */}
      <div
        ref={containerRef}
        className="relative z-10 h-screen flex flex-col items-center justify-center px-8 text-center"
      >
        {/* Eyebrow — always visible */}
        <div className="flex items-center gap-3 mb-14 opacity-40">
          <div className="w-5 h-px bg-white/40" />
          <span className="text-white/60 text-[10px] font-mono tracking-ultra uppercase">
            Powertrain Intelligence
          </span>
          <div className="w-5 h-px bg-white/40" />
        </div>

        {/* ── Full phrase TITAN · OPERATING · SYSTEM ── */}
        <div
          ref={titleRef}
          className="font-mono uppercase text-white leading-none flex items-center gap-6 md:gap-10 flex-wrap justify-center opacity-0"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 3.8rem)',
            letterSpacing: '0.1em',
          }}
        >
          <span ref={w0Ref} className="inline-block relative overflow-hidden whitespace-nowrap">
            T<span ref={r0Ref} className="inline-block">ITAN</span>
          </span>

          <span ref={dot0Ref} className="text-white/25 text-2xl">·</span>

          <span ref={w1Ref} className="inline-block relative overflow-hidden whitespace-nowrap">
            O<span ref={r1Ref} className="inline-block">PERATING</span>
          </span>

          <span ref={dot1Ref} className="text-white/25 text-2xl">·</span>

          <span ref={w2Ref} className="inline-block relative overflow-hidden whitespace-nowrap">
            S<span ref={r2Ref} className="inline-block">YSTEM</span>
          </span>
        </div>

        {/* ── TOS — PERFECTLY centered via top/left/translate ── */}
        <div
          ref={tosRef}
          className="font-mono uppercase text-white leading-none opacity-0"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(7rem, 17vw, 15rem)',
            letterSpacing: '0.65em',
            textShadow: '0 0 80px rgba(255,255,255,0.12), 0 0 200px rgba(255,255,255,0.05)',
          }}
        >
          TOS
        </div>

        {/* ── Subline — anchored at bottom of pinned area ── */}
        <div
          ref={subRef}
          className="opacity-0"
          style={{
            position: 'absolute',
            bottom: '18%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <p className="text-white/40 text-sm font-mono tracking-widest uppercase mb-2">
            Titan Operating System
          </p>
          <p className="text-white/20 text-[10px] font-mono max-w-xs mx-auto leading-relaxed">
            1,200 decisions per second.
            <br />
            The intelligence behind every revolution.
          </p>
        </div>
      </div>
    </section>
  );
}
