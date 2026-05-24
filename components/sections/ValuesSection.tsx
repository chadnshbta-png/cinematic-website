'use client';

import { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const values = [
  {
    index: '01',
    label: 'Foundation',
    title: 'Customers\nFirst',
    body: 'Every route optimized, every shipment handled, every decision made — with the people and businesses that trust us at the center.',
    accent: '#e8e8e8',
  },
  {
    index: '02',
    label: 'Discipline',
    title: 'Operational\nExcellence',
    body: 'Industry-leading on-time performance across 90+ countries. 160,000 specialists operating as one unified system.',
    accent: '#c0c0c0',
  },
  {
    index: '03',
    label: 'Reach',
    title: 'Global\nConnectivity',
    body: 'Air, sea, road — every mode, every market, every moment. A living network that keeps the world\'s supply chains in constant, intelligent motion.',
    accent: '#9eb0bc',
  },
  {
    index: '04',
    label: 'Technology',
    title: 'Intelligent\nInfrastructure',
    body: 'The DSV Operating System processes millions of data points per second — predicting disruption, rerouting in real time, learning with every shipment.',
    accent: '#8a9ba8',
  },
  {
    index: '05',
    label: 'Standard',
    title: 'Precision\nLogistics',
    body: 'Zero tolerance for error at planetary scale. Temperature-controlled healthcare freight, aerospace AOG response, high-value technology cargo — handled with surgical precision.',
    accent: '#78909c',
  },
  {
    index: '06',
    label: 'Future',
    title: 'Sustainable\nMovement',
    body: 'The next chapter of global logistics is green. DSV is committed to net-zero by 2050 — cutting emissions across every freight lane, every corridor, every continent.',
    accent: '#607d8b',
  },
];

const N = values.length;

export default function ValuesSection() {
  const outerRef    = useRef<HTMLDivElement>(null);
  const stickyRef   = useRef<HTMLDivElement>(null);
  const stackRef    = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const glowRef     = useRef<HTMLDivElement>(null);
  const stRef       = useRef<ScrollTrigger | null>(null);
  const tlRef       = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const outer  = outerRef.current;
    const sticky = stickyRef.current;
    const stack  = stackRef.current;
    if (!outer || !sticky || !stack) return;

    const calc = () => {
      const mobile = window.innerWidth < 768;
      // N-1 transitions (card 0 is pre-visible; cards 1..N-1 animate in)
      // Keep per-card scroll generous (1.1 vh each) without a dead zone at the end
      const transitions = N - 1;
      return {
        mobile,
        totalScroll: window.innerHeight * transitions * (mobile ? 0.9 : 1.1),
      };
    };

    let { mobile: isMobile, totalScroll } = calc();

    // CSS sticky requires an explicit outer height — set it now
    outer.style.height = `${window.innerHeight + totalScroll}px`;

    // Stack depth → visual state — NO opacity reduction
    // depth is conveyed by scale + blur + y + rotateX; solid surfaces handle masking
    const stackState = (depth: number) => ({
      y:       -depth * (isMobile ? 24 : 36),
      scale:   Math.max(0.84, 1 - depth * 0.032),
      rotateX: Math.min(depth * 1.5, 7),
      filter:  `blur(${Math.min(depth * 0.55, 2.8)}px)`,
    });

    // SEG spans 1/(N-1) of the timeline — one segment per incoming card
    const SEG = 1 / (N - 1);

    // Card 0 is the FOUNDATION — visible and stable from the first frame
    const card0 = cardRefs.current[0];
    if (card0) {
      gsap.set(card0, { y: 0, scale: 1, opacity: 1, rotateX: 0, filter: 'blur(0px)', zIndex: 1 });
    }

    // Cards 1..N-1 start below the viewport, invisible
    for (let i = 1; i < N; i++) {
      const card = cardRefs.current[i];
      if (!card) continue;
      gsap.set(card, {
        y:       window.innerHeight * 1.15,
        scale:   1,
        opacity: 0,
        rotateX: 0,
        filter:  'blur(0px)',
        zIndex:  i + 1,
      });
    }

    // Build the main scrub timeline (paused — driven by ScrollTrigger)
    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    // Each segment: one incoming card rises, all settled cards shift back one depth
    // duration = full SEG so tweens tile exactly — zero dead zones
    for (let i = 1; i < N; i++) {
      const card = cardRefs.current[i];
      if (!card) continue;

      const segStart = (i - 1) * SEG;

      // Incoming card rises from below into the active (front) position
      tl.fromTo(
        card,
        { y: window.innerHeight * 1.15, opacity: 0 },
        {
          y:        0,
          scale:    1,
          opacity:  1,
          rotateX:  0,
          filter:   'blur(0px)',
          ease:     'power3.out',
          duration: SEG,
        },
        segStart
      );

      // All previously settled cards (0 through i-1) push back one depth level
      for (let j = 0; j < i; j++) {
        const prev = cardRefs.current[j];
        if (!prev) continue;
        tl.to(
          prev,
          {
            ...stackState(i - j),
            ease:     'power2.inOut',
            duration: SEG,
          },
          segStart
        );
      }
    }

    // Ambient glow breathes across the full sequence
    if (glowRef.current) {
      tl.fromTo(
        glowRef.current,
        { opacity: 0.15 },
        { opacity: 0.55, ease: 'none', duration: 1 },
        0
      );
    }

    // Plain scroll-driven trigger — NO GSAP pin (CSS sticky handles sticking)
    // scrub:0.9 keeps motion responsive without feeling mechanical
    stRef.current = ScrollTrigger.create({
      trigger:             outer,
      start:               'top top',
      end:                 () => `+=${totalScroll}`,
      scrub:               0.9,
      invalidateOnRefresh: true,
      animation:           tl,
    });

    // Recalculate outer height on resize so CSS sticky keeps working
    const onResize = () => {
      const next = calc();
      isMobile    = next.mobile;
      totalScroll = next.totalScroll;
      outer.style.height = `${window.innerHeight + totalScroll}px`;
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      stRef.current?.kill();
      tlRef.current?.kill();
      window.removeEventListener('resize', onResize);
      outer.style.height = '';
    };
  }, []);

  return (
    <section
      ref={outerRef}
      id="values"
      className="relative bg-cinema-black"
      style={{ isolation: 'isolate' }}
    >
      {/*
        CSS position:sticky — activates exactly when this section's top
        hits the viewport top, with zero early activation.
        overflow:hidden + clip-path:inset(0) on THIS element (not its parent)
        so CSS sticky works while cards stay fully contained.
      */}
      <div
        ref={stickyRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', position: 'sticky', top: 0, clipPath: 'inset(0)' }}
      >
        {/* Ambient background glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(138,155,168,0.18) 0%, transparent 70%)',
            opacity: 0.15,
          }}
        />

        {/* Header — always visible at top */}
        <div className="absolute top-0 left-0 right-0 z-50 px-8 md:px-20 pt-14 pb-6 pointer-events-none">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-8 h-px bg-white/25" />
            <span className="text-white/35 text-[10px] font-mono tracking-ultra uppercase">
              Operating Principles
            </span>
          </div>
          <h2
            className="font-mono uppercase text-cinema-white leading-none"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', letterSpacing: '-0.03em' }}
          >
            What Drives Us
          </h2>
        </div>

        {/* Counter — top right */}
        <div className="absolute top-14 right-8 md:right-20 z-50 text-right pointer-events-none">
          <span className="font-mono text-[10px] tracking-widest uppercase text-white/25">
            0{N} Principles
          </span>
        </div>

        {/* Card stack container */}
        <div
          ref={stackRef}
          className="absolute inset-0 flex items-end justify-center pb-0"
          style={{
            perspective: '1400px',
            perspectiveOrigin: '50% 85%',
          }}
        >
          <div
            className="relative"
            style={{
              width: 'min(92vw, 860px)',
              height: 'min(62vh, 520px)',
            }}
          >
            {values.map((v, i) => (
              <div
                key={v.index}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="absolute inset-0"
                style={{
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                  zIndex: i + 1,
                }}
              >
                {/* Card surface */}
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{
                    background: `linear-gradient(158deg, #1c1e20 0%, #0e1012 55%, #161a1e 100%)`,
                    borderRadius: '2px',
                    boxShadow: `
                      0 -1px 0 0 rgba(255,255,255,0.07),
                      0 2px 40px rgba(0,0,0,0.7),
                      0 8px 80px rgba(0,0,0,0.5),
                      inset 0 1px 0 rgba(255,255,255,0.06)
                    `,
                  }}
                >
                  {/* Top-edge specular highlight */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent 0%, ${v.accent}60 30%, ${v.accent}90 50%, ${v.accent}60 70%, transparent 100%)` }}
                  />

                  {/* Inner grid overlay */}
                  <div className="absolute inset-0 opacity-[0.035] pointer-events-none">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id={`val-grid-${i}`} width="48" height="48" patternUnits="userSpaceOnUse">
                          <path d="M 48 0 L 0 0 0 48" fill="none" stroke={v.accent} strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#val-grid-${i})`} />
                    </svg>
                  </div>

                  {/* Atmospheric corner glow — painted over the opaque card surface */}
                  <div
                    className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at top right, ${v.accent}18 0%, #0e101200 65%)`,
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at bottom left, ${v.accent}0e 0%, #0e101200 65%)`,
                    }}
                  />

                  {/* Ghost index — oversized background numeral */}
                  <div
                    className="absolute right-8 bottom-4 font-mono font-bold leading-none select-none pointer-events-none"
                    style={{
                      fontSize: 'clamp(8rem, 18vw, 14rem)',
                      color: v.accent,
                      opacity: 0.045,
                      lineHeight: 1,
                    }}
                  >
                    {v.index}
                  </div>

                  {/* Corner brackets */}
                  <div className="absolute top-6 left-6 w-6 h-6 border-t border-l" style={{ borderColor: `${v.accent}45` }} />
                  <div className="absolute top-6 right-6 w-6 h-6 border-t border-r" style={{ borderColor: `${v.accent}45` }} />
                  <div className="absolute bottom-6 left-6 w-6 h-6 border-b border-l" style={{ borderColor: `${v.accent}25` }} />
                  <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r" style={{ borderColor: `${v.accent}25` }} />

                  {/* Scan-line texture */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
                    }}
                  />

                  {/* Card content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-10 md:p-14">
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: v.accent }} />
                        <span
                          className="font-mono text-[10px] tracking-ultra uppercase"
                          style={{ color: `${v.accent}80` }}
                        >
                          {v.label}
                        </span>
                      </div>
                      <span
                        className="font-mono text-[10px] tracking-widest"
                        style={{ color: 'rgba(255,255,255,0.2)' }}
                      >
                        {v.index} / 0{N}
                      </span>
                    </div>

                    {/* Main content */}
                    <div>
                      {/* Accent bar */}
                      <div
                        className="h-0.5 mb-7"
                        style={{ width: '56px', backgroundColor: v.accent }}
                      />

                      {/* Title — large, multi-line */}
                      <h3
                        className="font-mono uppercase leading-none mb-7"
                        style={{
                          fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
                          letterSpacing: '-0.025em',
                          color: v.accent,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {v.title}
                      </h3>

                      {/* Body copy */}
                      <p
                        className="font-mono text-[12px] leading-loose max-w-lg"
                        style={{ color: 'rgba(255,255,255,0.38)' }}
                      >
                        {v.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom edge fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-40"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(8,8,8,0.6))' }}
        />
      </div>
    </section>
  );
}
