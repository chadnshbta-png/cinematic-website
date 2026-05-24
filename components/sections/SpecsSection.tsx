'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import SplitType from 'split-type';

const specs = [
  { label: 'Horsepower', value: 1200, unit: 'HP', display: '1,200', percentage: 100 },
  { label: 'Torque', value: 1850, unit: 'Nm', display: '1,850', percentage: 95 },
  { label: 'Acceleration', value: 3.8, unit: 's', display: '3.8', percentage: 75 },
  { label: 'Top Speed', value: 280, unit: 'km/h', display: '280', percentage: 88 },
  { label: 'Payload', value: 2400, unit: 'kg', display: '2,400', percentage: 80 },
  { label: 'Range', value: 820, unit: 'km', display: '820', percentage: 72 },
];

const features = [
  { icon: '◈', title: 'Adaptive AI Suspension', desc: 'Real-time terrain reading with predictive damping' },
  { icon: '◇', title: 'Dual Hybrid Powerplant', desc: 'V12 ICE + dual electric motors for seamless torque delivery' },
  { icon: '○', title: 'Composite Monocoque', desc: 'Aerospace-derived chassis 40% lighter than steel' },
  { icon: '◉', title: 'Cinematic HUD', desc: '120Hz AR heads-up display with full driver assist suite' },
];

export default function SpecsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numbersRef = useRef<(HTMLElement | null)[]>([]);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const heading = section.querySelector('.specs-heading');
    if (heading) {
      const split = new SplitType(heading as HTMLElement, { types: 'chars' });
      gsap.fromTo(
        split.chars,
        { y: 80, opacity: 0, color: 'rgba(255,255,255,0.1)' },
        {
          y: 0,
          opacity: 1,
          color: 'rgba(255,255,255,0.85)',
          duration: 1.2,
          stagger: 0.025,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
          },
        }
      );
    }

    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const fill = bar.querySelector('.bar-fill') as HTMLElement;
      const targetWidth = specs[i].percentage;

      gsap.fromTo(
        fill,
        { width: '0%' },
        {
          width: `${targetWidth}%`,
          duration: 1.5,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: bar,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    numbersRef.current.forEach((el, i) => {
      if (!el) return;
      const target = specs[i].value;
      const obj = { val: 0 };

      gsap.fromTo(
        obj,
        { val: 0 },
        {
          val: target,
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.1,
          onUpdate: () => {
            const v = Math.round(obj.val);
            el.textContent = v >= 1000 ? v.toLocaleString() : String(v);
          },
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    const cards = section.querySelectorAll('[data-feature]');
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-40 overflow-hidden bg-cinema-black"
      id="performance"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.04]">
          <svg width="100%" height="100%" viewBox="0 0 600 800" fill="none">
            <circle cx="400" cy="400" r="300" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
            <circle cx="400" cy="400" r="200" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
            <circle cx="400" cy="400" r="100" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
            <line x1="100" y1="400" x2="700" y2="400" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
            <line x1="400" y1="100" x2="400" y2="700" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="absolute left-0 bottom-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-8 md:px-20">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-px bg-white/25" />
          <span className="text-white/35 text-[10px] font-mono tracking-ultra uppercase">
            Technical
          </span>
        </div>
        <h2
          className="specs-heading font-mono uppercase leading-none mb-20"
          style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.85)' }}
        >
          By the
          <br />
          Numbers
        </h2>

        {/* Specs grid */}
        <div className="grid md:grid-cols-2 gap-x-24 gap-y-12 mb-32">
          {specs.map((spec, i) => (
            <div key={spec.label} ref={(el) => { barsRef.current[i] = el; }} className="group">
              <div className="flex items-end justify-between mb-3">
                <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {spec.label}
                </span>
                <div className="flex items-baseline gap-1">
                  <span
                    ref={(el) => { numbersRef.current[i] = el; }}
                    className="font-mono text-2xl"
                    style={{ color: 'rgba(255,255,255,0.85)' }}
                  >
                    0
                  </span>
                  <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{spec.unit}</span>
                </div>
              </div>

              {/* Bar track */}
              <div className="h-px relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  className="bar-fill absolute top-0 left-0 h-full"
                  style={{ width: '0%', background: 'rgba(255,255,255,0.65)' }}
                />
              </div>

              <div className="flex justify-end mt-1.5">
                <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {spec.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 features-grid">
          {features.map((feature) => (
            <div
              key={feature.title}
              data-feature
              className="group relative p-8 cursor-default transition-all duration-500"
              style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)' }}
              />
              <div className="text-2xl mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>{feature.icon}</div>
              <h4 className="font-mono text-sm uppercase tracking-wide mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {feature.title}
              </h4>
              <p className="font-mono text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {feature.desc}
              </p>

              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r transition-colors duration-500" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />
            </div>
          ))}
        </div>

        {/* Grand total statement */}
        <div className="mt-32 pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-[10px] font-mono tracking-ultra uppercase mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Starting From
            </p>
            <div
              className="font-mono"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'rgba(255,255,255,0.85)' }}
            >
              $280,000
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-4 text-[11px] font-mono tracking-widest uppercase px-10 py-5 transition-all duration-300 hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.9)' }}
            >
              Configure Yours
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
            <p className="text-[10px] font-mono text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Available Q2 2025
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
