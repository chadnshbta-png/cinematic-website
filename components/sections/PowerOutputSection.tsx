'use client';

import { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import SplitType from 'split-type';

const statRows = [
  { label: 'Active Countries',  value: '90+',    unit: 'Nations', width: '100%' },
  { label: 'Global Facilities', value: '3,000+', unit: 'Sites',   width: '92%'  },
  { label: 'Team Members',      value: '160K+',  unit: 'People',  width: '96%'  },
  { label: 'Annual Shipments',  value: '75M+',   unit: 'Freight', width: '88%'  },
];

export default function PowerOutputSection() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const leftRef      = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLDivElement>(null);
  const bigNumRef    = useRef<HTMLDivElement>(null);
  const barRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const rowRefs      = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    // ── All animations use scrub so they REVERSE on scroll-up ──
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5,
      },
    });

    // Heading chars fall in downward
    if (headingRef.current) {
      const split = new SplitType(headingRef.current, { types: 'chars' });
      masterTl.fromTo(
        split.chars,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.04, duration: 0.5, ease: 'power3.out' },
        0
      );
    }

    // Big number animates downward entry
    if (bigNumRef.current) {
      masterTl.fromTo(
        bigNumRef.current,
        { y: -80, opacity: 0, filter: 'blur(12px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' },
        0.1
      );
    }

    // Each stat row animates downward sequentially
    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      masterTl.fromTo(
        row,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
        0.15 + i * 0.08
      );
    });

    // Stat bars fill from left (and empty on scroll-up)
    barRefs.current.forEach((bar, i) => {
      if (!bar) return;
      const fill = bar.querySelector('.stat-fill') as HTMLElement;
      if (!fill) return;
      const targetW = statRows[i].width;

      // Separate slower timeline for bar fills
      gsap.fromTo(fill,
        { width: '0%' },
        {
          width: targetW,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1.2,
          },
        }
      );
    });

    // Right panel: video + text — slide in from right (reverses)
    if (rightRef.current) {
      masterTl.fromTo(
        rightRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        0.05
      );
    }

    return () => {
      ScrollTrigger.getAll()
        .filter(s => s.vars.trigger instanceof Element
          && (s.vars.trigger as Element).closest?.('#power-output'))
        .forEach(s => s.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="power-output"
      className="relative bg-cinema-black"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

        {/* ── Left: Stats — light background ── */}
        <div
          ref={leftRef}
          className="relative flex flex-col justify-center px-8 md:px-16 py-24"
          style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="po-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M60 0L0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#po-grid)"/>
            </svg>
          </div>

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-5 h-px bg-white/20" />
            <span className="text-white/35 text-[10px] font-mono tracking-ultra uppercase">
              Global Scale
            </span>
          </div>

          {/* Heading */}
          <div
            ref={headingRef}
            className="text-white/40 text-[10px] font-mono tracking-widest uppercase mb-4"
          >
            Countries
          </div>

          {/* Big number */}
          <div
            ref={bigNumRef}
            className="font-mono text-cinema-white leading-none mb-12"
            style={{
              fontSize: 'clamp(5rem, 14vw, 11rem)',
              letterSpacing: '-0.04em',
            }}
          >
            90+
          </div>

          {/* Stat rows with bars */}
          <div className="space-y-8">
            {statRows.map((s, i) => (
              <div key={s.label} ref={el => { rowRefs.current[i] = el; }}>
                <div className="flex justify-between mb-2.5">
                  <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">
                    {s.label}
                  </span>
                  <span className="text-white/70 text-[11px] font-mono">
                    {s.value} <span className="text-white/30">{s.unit}</span>
                  </span>
                </div>

                <div
                  ref={el => { barRefs.current[i] = el; }}
                  className="h-px relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <div
                    className="stat-fill absolute top-0 left-0 h-full"
                    style={{ width: '0%', background: 'rgba(255,255,255,0.65)' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* V12 label */}
          <div className="mt-10 flex items-center gap-3">
            <div className="w-2 h-2 border rotate-45" style={{ borderColor: 'rgba(255,255,255,0.25)' }} />
            <span className="text-white/25 text-[10px] font-mono tracking-widest uppercase">
              DSV Operating System — Live Network
            </span>
          </div>
        </div>

        {/* ── Right: Video + micro stats ── */}
        <div ref={rightRef} className="relative overflow-hidden min-h-[50vh] md:min-h-0">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.55, filter: 'grayscale(30%)' }}
            src="/video/Ultra_realistic_cinematic_comm (1).mp4"
            muted
            loop
            playsInline
            preload="metadata"
          />

          {/* Dark cinematic blend over video */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.2) 50%, rgba(8,8,8,0.7) 100%)' }}
          />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-14">
            <div className="grid grid-cols-2 gap-8">
              {[
                { label: 'Air Routes',  value: '300+' },
                { label: 'Sea Routes',  value: '500+' },
                { label: 'Road Lines',  value: '1,200+' },
                { label: 'Ports',       value: '850+' },
              ].map(stat => (
                <div key={stat.label} className="border-l border-white/20 pl-4">
                  <p className="text-white/50 text-[9px] font-mono tracking-widest uppercase mb-1">
                    {stat.label}
                  </p>
                  <p className="text-white/90 font-mono text-xl">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scan lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.5) 3px, rgba(0,0,0,0.5) 4px)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
