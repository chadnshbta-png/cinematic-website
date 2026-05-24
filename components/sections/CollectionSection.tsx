'use client';

import { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import SplitType from 'split-type';

interface IndustryCard {
  id: string;
  name: string;
  tagline: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  accent: string;
}

const industries: IndustryCard[] = [
  { id: 'automotive',   name: 'Automotive',   tagline: 'OEM Supply Chain',          stat1Value: '500+',  stat1Label: 'OEM Partners',         stat2Value: '47',     stat2Label: 'Countries',   accent: '#ffffff' },
  { id: 'healthcare',   name: 'Healthcare',   tagline: 'Temperature Controlled',    stat1Value: '2–8°C', stat1Label: 'Cold Chain Precision',  stat2Value: '95+',    stat2Label: 'Facilities',  accent: '#c8c8c8' },
  { id: 'technology',   name: 'Technology',   tagline: 'High-Value Freight',        stat1Value: '99.9%', stat1Label: 'On-Time Delivery',      stat2Value: '6',      stat2Label: 'Continents',  accent: '#8A9BA8' },
  { id: 'industrial',   name: 'Industrial',   tagline: 'Project Cargo',             stat1Value: '500t',  stat1Label: 'Maximum Payload',       stat2Value: '1,200+', stat2Label: 'Projects',    accent: '#a0a8b0' },
  { id: 'aerospace',    name: 'Aerospace',    tagline: 'Precision Logistics',       stat1Value: 'AOG',   stat1Label: 'Priority Response',     stat2Value: '24h',    stat2Label: 'Coverage',    accent: '#d0d0d0' },
  { id: 'consumer',     name: 'Consumer',     tagline: 'E-Commerce & Retail',       stat1Value: '50M+',  stat1Label: 'Annual Parcels',        stat2Value: '3,000+', stat2Label: 'Locations',   accent: '#b8b8b8' },
];

const CARD_WIDTH_VW = 75;
const CARD_GAP_VW  = 3;

export default function CollectionSection() {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLDivElement>(null);
  const stRef        = useRef<ScrollTrigger | null>(null);
  const tweenRef     = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    // Measure actual DOM widths so nothing is guessed
    const calcEnd = () => track.scrollWidth - wrapper.offsetWidth;

    tweenRef.current = gsap.to(track, {
      x: () => -calcEnd(),
      ease: 'none',
    });

    stRef.current = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${calcEnd()}`,
      pin: true,
      pinSpacing: true,
      scrub: 1.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      animation: tweenRef.current,
    });

    // Heading split text
    const headEl = headingRef.current?.querySelector('h2');
    if (headEl) {
      const split = new SplitType(headEl as HTMLElement, { types: 'chars' });
      gsap.fromTo(
        split.chars,
        { y: 70, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2, stagger: 0.025, ease: 'power4.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
        }
      );
    }

    // Cards stagger in
    const cards = track.querySelectorAll('[data-card]');
    gsap.fromTo(cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 0.9, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: wrapper, start: 'top 70%', toggleActions: 'play none none none' },
      }
    );

    // Force a refresh after mount so pin spacing is exact
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      stRef.current?.kill();
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <section id="collection" className="relative bg-cinema-black">

      {/* ── Section heading (normal flow, scrolls before pin) ─────────── */}
      <div
        ref={headingRef}
        className="relative z-10 px-8 md:px-20 pt-20 md:pt-32 pb-12 md:pb-20 bg-cinema-black"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-px bg-white/25" />
          <span className="text-white/35 text-[10px] font-mono tracking-ultra uppercase">
            Our Expertise
          </span>
        </div>

        <h2
          className="font-mono uppercase text-cinema-white leading-none"
          style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.02em' }}
        >
          Industry Solutions
        </h2>

        <p className="text-cinema-silver/50 mt-4 font-mono text-sm max-w-lg">
          Six global verticals. One connected intelligence network.
        </p>

        <div className="absolute right-8 md:right-20 bottom-6 flex items-center gap-3 text-cinema-silver/30">
          <span className="hidden md:inline text-[10px] font-mono tracking-widest uppercase">Drag to explore</span>
          <span className="md:hidden text-[10px] font-mono tracking-widest uppercase">Swipe to explore</span>
          <svg width="40" height="8" viewBox="0 0 40 8" fill="none">
            <path d="M0 4h38M34 1l4 3-4 3" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* ── Pinned carousel wrapper ────────────────────────────────────── */}
      {/*
          This div is exactly 100vh tall and becomes the GSAP pin target.
          It has overflow:hidden so the track can slide freely inside.
          pinSpacing adds a matching spacer so the next section starts correctly.
      */}
      <div
        ref={wrapperRef}
        className="relative w-full overflow-hidden bg-cinema-black"
        style={{ height: '100vh' }}
      >
        {/* ── Sliding track ─────────────────────────────────────────────── */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 h-full flex"
          style={{
            width: `${industries.length * (CARD_WIDTH_VW + CARD_GAP_VW)}vw`,
            willChange: 'transform',
          }}
        >
          {industries.map((industry, index) => (
            <div
              key={industry.id}
              data-card
              className="relative flex-shrink-0 h-full border-r border-white/[0.04] overflow-hidden"
              style={{ width: `${CARD_WIDTH_VW}vw`, marginRight: `${CARD_GAP_VW}vw` }}
            >
              {/* Card background */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(145deg, ${industry.accent}14 0%, transparent 55%, rgba(8,8,8,0.92) 100%)`,
                }}
              />
              <div className="absolute inset-0 bg-cinema-dark/75" />

              {/* Grid decoration */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id={`g-${industry.id}`} width="80" height="80" patternUnits="userSpaceOnUse">
                      <path d="M80 0L0 0 0 80" fill="none" stroke={industry.accent} strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#g-${industry.id})`}/>
                </svg>
              </div>

              {/* Large ghost number */}
              <div
                className="absolute right-10 top-1/2 -translate-y-1/2 font-mono font-bold leading-none select-none pointer-events-none"
                style={{ fontSize: 'clamp(14rem,28vw,22rem)', color: industry.accent, opacity: 0.04 }}
              >
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Card content */}
              <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-16">
                {/* Index label */}
                <div className="absolute top-10 left-12 text-cinema-silver/25 text-[10px] font-mono tracking-widest">
                  {String(index + 1).padStart(2, '0')} — {String(industries.length).padStart(2, '0')}
                </div>

                {/* Accent bar */}
                <div className="w-12 h-0.5 mb-5" style={{ backgroundColor: industry.accent }} />

                {/* Tagline */}
                <p className="text-cinema-silver/40 text-[10px] font-mono tracking-ultra uppercase mb-3">
                  {industry.tagline}
                </p>

                {/* Name */}
                <h3
                  className="font-mono uppercase text-cinema-white leading-none mb-8"
                  style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
                >
                  {industry.name}
                </h3>

                {/* Metrics */}
                <div className="flex items-center gap-10 mb-8">
                  <div>
                    <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: industry.accent }}>
                      {industry.stat1Label}
                    </p>
                    <p className="text-cinema-white font-mono text-3xl leading-none">{industry.stat1Value}</p>
                  </div>
                  <div className="w-px h-14 bg-white/8" />
                  <div>
                    <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: industry.accent }}>
                      {industry.stat2Label}
                    </p>
                    <p className="text-cinema-white font-mono text-2xl leading-none">{industry.stat2Value}</p>
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="self-start text-[10px] font-mono tracking-widest uppercase px-8 py-3.5 border transition-all duration-400 hover:text-cinema-black"
                  style={{ borderColor: industry.accent, color: industry.accent }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = industry.accent;
                    (e.currentTarget as HTMLButtonElement).style.color = '#080808';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = industry.accent;
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {industries.map((ind, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-white/20" style={{ backgroundColor: i === 0 ? ind.accent : undefined }} />
          ))}
        </div>
      </div>
    </section>
  );
}
