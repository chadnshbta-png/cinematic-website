'use client';

import { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import SplitType from 'split-type';

interface TruckModel {
  id: string;
  name: string;
  tagline: string;
  hp: string;
  torque: string;
  accent: string;
}

const models: TruckModel[] = [
  { id: 'titan-x',   name: 'Titan X',   tagline: 'The Apex Predator',      hp: '1,200', torque: '1,850 Nm', accent: '#ffffff' },
  { id: 'titan-pro', name: 'Titan Pro', tagline: 'Uncompromising Power',    hp: '850',   torque: '1,450 Nm', accent: '#c8c8c8' },
  { id: 'titan-s',   name: 'Titan S',   tagline: 'Born on the Track',       hp: '650',   torque: '1,200 Nm', accent: '#8A9BA8' },
  { id: 'titan-e',   name: 'Titan E',   tagline: 'The Future of Power',     hp: '720',   torque: '1,600 Nm', accent: '#a0a8b0' },
];

const CARD_WIDTH_VW = 88;
const CARD_GAP_VW  = 4;

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
            Our Fleet
          </span>
        </div>

        <h2
          className="font-mono uppercase text-cinema-white leading-none"
          style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.02em' }}
        >
          The Collection
        </h2>

        <p className="text-cinema-silver/50 mt-4 font-mono text-sm max-w-lg">
          Four distinct expressions of power, performance, and prestige.
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
            width: `${models.length * (CARD_WIDTH_VW + CARD_GAP_VW)}vw`,
            willChange: 'transform',
          }}
        >
          {models.map((model, index) => (
            <div
              key={model.id}
              data-card
              className="relative flex-shrink-0 h-full border-r border-white/[0.04] overflow-hidden"
              style={{ width: `${CARD_WIDTH_VW}vw`, marginRight: `${CARD_GAP_VW}vw` }}
            >
              {/* Card background */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(145deg, ${model.accent}14 0%, transparent 55%, rgba(8,8,8,0.92) 100%)`,
                }}
              />
              <div className="absolute inset-0 bg-cinema-dark/75" />

              {/* Grid decoration */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id={`g-${model.id}`} width="80" height="80" patternUnits="userSpaceOnUse">
                      <path d="M80 0L0 0 0 80" fill="none" stroke={model.accent} strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#g-${model.id})`}/>
                </svg>
              </div>

              {/* Large ghost number */}
              <div
                className="absolute right-10 top-1/2 -translate-y-1/2 font-mono font-bold leading-none select-none pointer-events-none"
                style={{ fontSize: 'clamp(14rem,28vw,22rem)', color: model.accent, opacity: 0.04 }}
              >
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Card content */}
              <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-16">
                {/* Index label */}
                <div className="absolute top-10 left-12 text-cinema-silver/25 text-[10px] font-mono tracking-widest">
                  {String(index + 1).padStart(2, '0')} — {String(models.length).padStart(2, '0')}
                </div>

                {/* Accent bar */}
                <div className="w-12 h-0.5 mb-5" style={{ backgroundColor: model.accent }} />

                {/* Tagline */}
                <p className="text-cinema-silver/40 text-[10px] font-mono tracking-ultra uppercase mb-3">
                  {model.tagline}
                </p>

                {/* Name */}
                <h3
                  className="font-mono uppercase text-cinema-white leading-none mb-8"
                  style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
                >
                  {model.name}
                </h3>

                {/* Specs */}
                <div className="flex items-center gap-10 mb-8">
                  <div>
                    <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: model.accent }}>
                      Power
                    </p>
                    <p className="text-cinema-white font-mono text-3xl leading-none">{model.hp}</p>
                    <p className="text-cinema-silver/30 text-[9px] font-mono mt-0.5">HP</p>
                  </div>
                  <div className="w-px h-14 bg-white/8" />
                  <div>
                    <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: model.accent }}>
                      Torque
                    </p>
                    <p className="text-cinema-white font-mono text-2xl leading-none">{model.torque}</p>
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="self-start text-[10px] font-mono tracking-widest uppercase px-8 py-3.5 border transition-all duration-400 hover:text-cinema-black"
                  style={{ borderColor: model.accent, color: model.accent }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = model.accent;
                    (e.currentTarget as HTMLButtonElement).style.color = '#080808';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = model.accent;
                  }}
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {models.map((m, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-white/20" style={{ backgroundColor: i === 0 ? m.accent : undefined }} />
          ))}
        </div>
      </div>
    </section>
  );
}
