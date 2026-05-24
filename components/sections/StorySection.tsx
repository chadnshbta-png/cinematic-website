'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';
import SplitType from 'split-type';

const storyBeats = [
  {
    year: '1976',
    headline: 'The Origin',
    body: 'From a single freight corridor in Northern Europe, a global network began to take shape. The first DSV route connected what others could not reach — and redefined the standard for logistics.',
    accent: '#ffffff',
    position: 'left',
  },
  {
    year: '1997',
    headline: 'The Network',
    body: 'Two decades of relentless expansion established DSV across 17 countries — the backbone of European freight. The first integrated logistics intelligence platform went live.',
    accent: '#d0d0d0',
    position: 'right',
  },
  {
    year: '2008',
    headline: 'The Intelligence',
    body: 'When technology meets ambition, mastery begins. DSV Operating System launched — processing real-time telemetry across every freight line. The network learned to think.',
    accent: '#a0a8b0',
    position: 'left',
  },
  {
    year: '2025',
    headline: 'The Vision',
    body: 'The culmination of 49 years of obsession. 1,200 active global routes. Autonomous coordination. Zero margin for error. DSV X doesn\'t just move cargo — it predicts where the world is going.',
    accent: '#8A9BA8',
    position: 'right',
  },
];

export default function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Section entrance — chars rise, color illuminates from near-invisible to white
    const headingEl = section.querySelector('.story-heading');
    if (headingEl) {
      const split = new SplitType(headingEl as HTMLElement, { types: 'chars' });
      gsap.fromTo(
        split.chars,
        { y: 100, opacity: 0, color: 'rgba(255,255,255,0.1)' },
        {
          y: 0,
          opacity: 1,
          color: 'rgba(255,255,255,0.85)',
          duration: 1.4,
          stagger: 0.03,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headingEl,
            start: 'top 80%',
          },
        }
      );
    }

    // Progress line animation
    if (progressLineRef.current) {
      gsap.fromTo(
        progressLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
        }
      );
    }

    // Each story beat
    beatRefs.current.forEach((beat, i) => {
      if (!beat) return;

      const textEls = beat.querySelectorAll('[data-story-text]');
      const visual = beat.querySelector('.story-visual');
      const yearEl = beat.querySelector('.story-year');
      const lineEl = beat.querySelector('.story-accent-line');

      // Year counter
      if (yearEl) {
        gsap.fromTo(
          yearEl,
          { opacity: 0, x: storyBeats[i].position === 'left' ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: beat,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Accent line
      if (lineEl) {
        gsap.fromTo(
          lineEl,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: 'power3.out',
            transformOrigin: 'left center',
            scrollTrigger: {
              trigger: beat,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Text reveals
      textEls.forEach((el) => {
        const split = new SplitType(el as HTMLElement, { types: 'lines' });
        gsap.fromTo(
          split.lines,
          { y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.0,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: beat,
              start: 'top 65%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Visual parallax
      if (visual) {
        gsap.fromTo(
          visual,
          { scale: 1.1, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: beat,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        ScrollTrigger.create({
          trigger: beat,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(visual, { y: self.progress * -40 });
          },
        });
      }
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-cinema-black"
      id="story"
    >
      {/* Subtle background atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(255,255,255,0.02)' }} />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(255,255,255,0.02)' }} />
      </div>

      {/* Section header */}
      <div className="relative px-8 md:px-20 mb-32">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-px bg-white/25" />
          <span className="text-white/35 text-[10px] font-mono tracking-ultra uppercase">
            Heritage
          </span>
        </div>
        <h2
          className="story-heading font-mono uppercase text-white/85 leading-none"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.03em' }}
        >
          Our Story
        </h2>
        <p className="text-white/40 font-mono text-sm mt-6 max-w-md">
          Five decades of logistics obsession, distilled into one global network.
        </p>
      </div>

      {/* Timeline beats */}
      <div className="relative max-w-screen-xl mx-auto px-8 md:px-20">
        {/* Center timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div
            ref={progressLineRef}
            className="w-full scale-y-0 origin-top"
            style={{ height: '100%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.15))' }}
          />
        </div>

        {storyBeats.map((beat, i) => (
          <div
            key={beat.year}
            ref={(el) => { beatRefs.current[i] = el; }}
            className={`relative grid md:grid-cols-2 gap-12 md:gap-24 mb-32 items-center ${
              beat.position === 'right' ? 'md:[direction:rtl]' : ''
            }`}
          >
            {/* Text side */}
            <div className={beat.position === 'right' ? 'md:[direction:ltr]' : ''}>
              <div
                className="story-year font-mono leading-none select-none mb-8"
                style={{ fontSize: 'clamp(4rem, 8vw, 8rem)', color: 'rgba(255,255,255,0.07)' }}
              >
                {beat.year}
              </div>

              <div
                className="story-accent-line h-0.5 w-12 mb-6 origin-left"
                style={{ backgroundColor: beat.accent }}
              />

              <h3
                data-story-text
                className="font-mono uppercase leading-tight mb-6"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  letterSpacing: '-0.02em',
                  color: beat.accent,
                }}
              >
                {beat.headline}
              </h3>

              <p
                data-story-text
                className="font-mono text-base leading-relaxed max-w-md"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                {beat.body}
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: beat.accent }} />
                <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  Chapter {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Visual side */}
            <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: '4/3' }}>
              <div
                className="story-visual absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${beat.accent}25 0%, rgba(8,8,8,0.9) 60%, ${beat.accent}10 100%)`,
                }}
              />

              {/* Geometric decorative elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-64 h-64 rounded-full border opacity-10"
                  style={{ borderColor: beat.accent }}
                />
                <div
                  className="absolute w-48 h-48 rounded-full border opacity-20"
                  style={{ borderColor: beat.accent }}
                />
                <div
                  className="absolute w-32 h-32 rounded-full border opacity-30"
                  style={{ borderColor: beat.accent }}
                />

                {/* Year as large graphic */}
                <div
                  className="absolute font-mono font-bold opacity-10"
                  style={{ fontSize: '8rem', color: beat.accent }}
                >
                  {beat.year.slice(2)}
                </div>
              </div>

              {/* Grid lines */}
              <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id={`story-grid-${i}`} width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke={beat.accent} strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#story-grid-${i})`} />
                </svg>
              </div>

              {/* Corner accents */}
              <div
                className="absolute top-4 left-4 w-8 h-8 border-t border-l"
                style={{ borderColor: `${beat.accent}60` }}
              />
              <div
                className="absolute bottom-4 right-4 w-8 h-8 border-b border-r"
                style={{ borderColor: `${beat.accent}60` }}
              />

              {/* Caption */}
              <div className="absolute bottom-6 left-6">
                <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {beat.year} — {beat.headline}
                </span>
              </div>
            </div>

            {/* Timeline dot */}
            <div
              className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 z-10"
              style={{ borderColor: beat.accent, backgroundColor: '#080808' }}
            >
              <div
                className="absolute inset-1 rounded-full"
                style={{ backgroundColor: beat.accent }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Closing statement */}
      <div className="relative px-8 md:px-20 mt-16 text-center">
        <div
          className="font-mono uppercase leading-none select-none"
          style={{ fontSize: 'clamp(4rem, 12vw, 12rem)', letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.05)' }}
        >
          DSV
        </div>
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Since 1976
        </p>
      </div>
    </section>
  );
}
