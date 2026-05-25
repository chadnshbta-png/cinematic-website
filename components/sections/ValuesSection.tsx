'use client';

import { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

// ─── Toggle DEBUG to verify card order before reviewing cinematic styling ───
const DEBUG = false;
const DEBUG_BG = ['#e50000', '#e57700', '#e5d200', '#009921', '#0058e5', '#8800e5'];

const values = [
  {
    index: '01', label: 'Foundation',
    title: 'Customers\nFirst',
    body: 'Every route optimized, every shipment handled, every decision made — with the people and businesses that trust us at the center.',
    accent: '#e8e8e8',
  },
  {
    index: '02', label: 'Discipline',
    title: 'Operational\nExcellence',
    body: 'Industry-leading on-time performance across 90+ countries. 160,000 specialists operating as one unified system.',
    accent: '#c0c0c0',
  },
  {
    index: '03', label: 'Reach',
    title: 'Global\nConnectivity',
    body: "Air, sea, road — every mode, every market, every moment. A living network that keeps the world's supply chains in constant, intelligent motion.",
    accent: '#9eb0bc',
  },
  {
    index: '04', label: 'Technology',
    title: 'Intelligent\nInfrastructure',
    body: 'The DSV Operating System processes millions of data points per second — predicting disruption, rerouting in real time, learning with every shipment.',
    accent: '#8a9ba8',
  },
  {
    index: '05', label: 'Standard',
    title: 'Precision\nLogistics',
    body: 'Zero tolerance for error at planetary scale. Temperature-controlled healthcare freight, aerospace AOG response, high-value technology cargo — handled with surgical precision.',
    accent: '#78909c',
  },
  {
    index: '06', label: 'Future',
    title: 'Sustainable\nMovement',
    body: 'The next chapter of global logistics is green. DSV is committed to net-zero by 2050 — cutting emissions across every freight lane, every corridor, every continent.',
    accent: '#607d8b',
  },
];

const N = values.length;

export default function ValuesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards: HTMLDivElement[] = [];
    for (let i = 0; i < N; i++) {
      const c = cardRefs.current[i];
      if (!c) continue;
      cards.push(c);
    }
    if (cards.length !== N) return;

    // ── Timeline ───────────────────────────────────────────────────────────
    // Cards 1–(N-1) each slide from y:110% → y:0 sequentially.
    // fromTo with explicit from-state so GSAP never guesses initial position.
    // The only animated property is translateY — nothing else.
    const SEG = 1 / (N - 1);
    const tl  = gsap.timeline({ paused: true });

    for (let i = 1; i < N; i++) {
      tl.fromTo(
        cards[i],
        { y: '110%' },
        { y: 0, ease: 'power2.inOut', duration: SEG },
        (i - 1) * SEG,
      );
    }

    // ── ScrollTrigger — pin: true replaces CSS sticky entirely ─────────────
    // GSAP owns the scroll space via pinSpacing; no section.style.height needed.
    const st = ScrollTrigger.create({
      trigger:    section,
      pin:        true,
      pinSpacing: true,
      start:      'top top',
      end:        () => `+=${(N - 1) * window.innerHeight}`,
      scrub:      0.4,
      animation:  tl,
    });

    return () => {
      st.kill();
      tl.kill();
      gsap.set(cards, { clearProps: 'all' });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="values"
      className="relative bg-cinema-black"
      style={{ height: '100vh' }}
    >
      {/* Section header — always above cards */}
      <div className="absolute top-0 left-0 right-0 z-[100] px-8 md:px-20 pt-14 pb-6 pointer-events-none">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-px bg-white/25" />
          <span className="text-white/35 text-[10px] font-mono tracking-[0.25em] uppercase">
            Operating Principles
          </span>
        </div>
        <h2
          className="font-mono uppercase text-white leading-none"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', letterSpacing: '-0.03em' }}
        >
          What Drives Us
        </h2>
      </div>

      {/* Counter */}
      <div className="absolute top-14 right-8 md:right-20 z-[100] text-right pointer-events-none">
        <span className="font-mono text-[10px] tracking-widest uppercase text-white/25">
          0{N} Principles
        </span>
      </div>

      {/*
        Card stack.
        overflow:hidden clips rising cards below the container edge.
        transform:translateZ(0) promotes to a GPU compositing layer so
        the overflow clip is enforced even when child transforms are composited.
        NO willChange on card wrappers — GSAP temporarily promotes only during motion.
      */}
      <div className="absolute inset-0 flex items-end justify-center">
        <div
          className="relative"
          style={{
            width:     'min(92vw, 860px)',
            height:    'min(62vh, 520px)',
            overflow:  'hidden',
            transform: 'translateZ(0)',
          }}
        >
          {values.map((v, i) => (
            <div
              key={v.index}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="absolute inset-0"
              style={{
                zIndex: i + 1,
                // CSS sets initial state at render time — card 0 visible,
                // cards 1-N hidden below container before GSAP runs.
                transform: i === 0 ? 'none' : 'translateY(110%)',
              }}
            >
              {DEBUG ? (
                /* ── DEBUG VIEW — verify order 1→2→3→4→5→6 ────────────── */
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: DEBUG_BG[i] }}
                >
                  <span style={{ fontSize: 160, fontWeight: 900, color: 'white', lineHeight: 1 }}>
                    {i + 1}
                  </span>
                </div>
              ) : (
                /* ── CINEMATIC CARD ──────────────────────────────────────── */
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{
                    background: 'linear-gradient(158deg, #1c1e20 0%, #0e1012 55%, #161a1e 100%)',
                    borderRadius: '2px',
                    boxShadow: '0 -1px 0 0 rgba(255,255,255,0.07), 0 2px 40px rgba(0,0,0,0.7), 0 8px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Top specular edge */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${v.accent}90 50%, transparent)` }}
                  />

                  {/* Grid texture */}
                  <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.035 }}>
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id={`vg-${i}`} width="48" height="48" patternUnits="userSpaceOnUse">
                          <path d="M 48 0 L 0 0 0 48" fill="none" stroke={v.accent} strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#vg-${i})`} />
                    </svg>
                  </div>

                  {/* Corner glows */}
                  <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top right, ${v.accent}18 0%, transparent 65%)` }} />
                  <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at bottom left, ${v.accent}0e 0%, transparent 65%)` }} />

                  {/* Ghost index */}
                  <div
                    className="absolute right-8 bottom-4 font-mono font-bold select-none pointer-events-none"
                    style={{ fontSize: 'clamp(8rem, 18vw, 14rem)', color: v.accent, opacity: 0.045, lineHeight: 1 }}
                  >
                    {v.index}
                  </div>

                  {/* Corner brackets */}
                  <div className="absolute top-6 left-6 w-6 h-6 border-t border-l" style={{ borderColor: `${v.accent}45` }} />
                  <div className="absolute top-6 right-6 w-6 h-6 border-t border-r" style={{ borderColor: `${v.accent}45` }} />
                  <div className="absolute bottom-6 left-6 w-6 h-6 border-b border-l" style={{ borderColor: `${v.accent}25` }} />
                  <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r" style={{ borderColor: `${v.accent}25` }} />

                  {/* Scan lines */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)' }} />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-10 md:p-14">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: v.accent }} />
                        <span className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: `${v.accent}80` }}>
                          {v.label}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {v.index} / 0{N}
                      </span>
                    </div>

                    <div>
                      <div className="h-0.5 mb-7" style={{ width: '56px', backgroundColor: v.accent }} />
                      <h3
                        className="font-mono uppercase leading-none mb-7"
                        style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)', letterSpacing: '-0.025em', color: v.accent, whiteSpace: 'pre-line' }}
                      >
                        {v.title}
                      </h3>
                      <p className="font-mono text-[12px] leading-loose max-w-lg" style={{ color: 'rgba(255,255,255,0.38)' }}>
                        {v.body}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[90]"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(8,8,8,0.6))' }}
      />
    </section>
  );
}
