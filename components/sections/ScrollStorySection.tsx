'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import SplitType from 'split-type';

const paragraphs = [
  {
    number: '01',
    title: 'The Command',
    body: 'At the heart of the Titan X sits a 6.8-litre twin-turbo V12 paired with a dual electric drive system. 1,200 horsepower available on demand. The instant you need it. Without hesitation.',
  },
  {
    number: '02',
    title: 'The Chassis',
    body: 'A titanium-carbon monocoque frame — borrowed from aerospace engineering — gives the Titan X a structural rigidity that no conventional truck chassis can match. 40% lighter. 3× stronger.',
  },
  {
    number: '03',
    title: 'The Intelligence',
    body: 'Titan Operating System processes 1,200 data points per second. Terrain mapping, predictive suspension, torque vectoring, real-time stability control. The Titan thinks before you react.',
  },
  {
    number: '04',
    title: 'The Presence',
    body: 'Designed by the same studio responsible for three consecutive "Car of the Year" awards. Every surface is purposeful. Every proportion deliberate. The Titan X is not designed — it is sculpted.',
  },
];

export default function ScrollStorySection() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);
  const parasRef      = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef   = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Start video
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    // Heading reveal
    if (headingRef.current) {
      const split = new SplitType(headingRef.current, { types: 'chars' });
      gsap.fromTo(
        split.chars,
        { y: 60, opacity: 0, rotateX: -30, transformOrigin: '50% 100%' },
        {
          y: 0, opacity: 1, rotateX: 0,
          duration: 1.2, stagger: 0.03, ease: 'power4.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
        }
      );
    }

    // Per-paragraph: fade + highlight as it enters viewport
    parasRef.current.forEach((para, i) => {
      if (!para) return;

      const numEl    = para.querySelector('[data-num]');
      const titleEl  = para.querySelector('[data-title]');
      const bodyEl   = para.querySelector('[data-body]');
      const lineEl   = para.querySelector('[data-line]');

      ScrollTrigger.create({
        trigger: para,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter:  () => activatePara(para, numEl, titleEl, bodyEl, lineEl, i),
        onLeave:  () => deactivatePara(para),
        onEnterBack:  () => activatePara(para, numEl, titleEl, bodyEl, lineEl, i),
        onLeaveBack:  () => deactivatePara(para),
      });

      // Initial hidden state
      gsap.set(para, { opacity: 0.18 });
    });

    // Scroll progress bar
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll()
        .filter(s => s.vars.trigger && (s.vars.trigger as Element).closest?.('#scroll-story'))
        .forEach(s => s.kill());
    };
  }, []);

  function activatePara(
    para: Element,
    numEl: Element | null,
    titleEl: Element | null,
    bodyEl: Element | null,
    lineEl: Element | null,
    index: number,
  ) {
    gsap.to(para, { opacity: 1, duration: 0.5, ease: 'power2.out' });

    if (lineEl) {
      gsap.fromTo(lineEl, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power3.out', transformOrigin: 'left' });
    }

    if (numEl) {
      gsap.fromTo(numEl, { opacity: 0.2, x: -10 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
    }

    if (titleEl) {
      const split = new SplitType(titleEl as HTMLElement, { types: 'chars' });
      gsap.fromTo(
        split.chars,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.03, ease: 'power3.out' }
      );
    }

    if (bodyEl) {
      gsap.fromTo(bodyEl, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power2.out' });
    }
  }

  function deactivatePara(para: Element) {
    gsap.to(para, { opacity: 0.18, duration: 0.4, ease: 'power2.in' });
  }

  return (
    <section
      ref={sectionRef}
      id="scroll-story"
      className="relative bg-cinema-black"
    >
      {/* Progress line (left edge) */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 z-20">
        <div
          ref={progressRef}
          className="absolute top-0 left-0 w-full bg-white/30 scale-y-0 origin-top"
          style={{ height: '100%' }}
        />
      </div>

      <div className="max-w-screen-xl mx-auto px-8 md:px-20 pt-32 pb-20">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-px bg-white/25" />
          <span className="text-white/35 text-[10px] font-mono tracking-ultra uppercase">
            Engineering
          </span>
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className="font-mono uppercase text-cinema-white leading-none mb-24"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', letterSpacing: '-0.03em', perspective: '800px' }}
        >
          The Science of
          <br />
          <span className="text-white">Dominance</span>
        </h2>
      </div>

      {/* ── Sticky layout ── */}
      <div className="flex flex-col md:flex-row relative">

        {/* ── Left: sticky video panel ── */}
        <div
          className="hidden md:block md:w-1/2 relative"
          style={{ minHeight: `${paragraphs.length * 60}vh` }}
        >
          <div className="sticky top-0 h-screen overflow-hidden">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover scale-105"
              src="/video/Ultra_realistic_cinematic_comm (1).mp4"
              muted
              loop
              playsInline
              preload="metadata"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cinema-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/60 via-transparent to-cinema-black/20" />

            {/* Corner decoration */}
            <div className="absolute top-8 left-8 border-t border-l border-white/12 w-12 h-12" />
            <div className="absolute bottom-8 right-8 border-b border-r border-white/12 w-12 h-12" />

            {/* Video label */}
            <div className="absolute bottom-10 left-8">
              <p className="text-cinema-silver/30 text-[9px] font-mono tracking-ultra uppercase">
                Live — Titan X Prototype
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: scrolling paragraphs ── */}
        <div className="w-full md:w-1/2 px-8 md:px-16 py-10 md:py-0">
          {paragraphs.map((p, i) => (
            <div
              key={p.number}
              ref={el => { parasRef.current[i] = el; }}
              className="relative mb-32 last:mb-40"
              style={{ minHeight: '55vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              {/* Accent line */}
              <div
                data-line
                className="w-10 h-0.5 bg-white/30 mb-5"
                style={{ transformOrigin: 'left', transform: 'scaleX(0)' }}
              />

              {/* Number */}
              <span
                data-num
                className="text-white/30 text-[10px] font-mono tracking-ultra uppercase mb-4 block"
              >
                {p.number}
              </span>

              {/* Title */}
              <h3
                data-title
                className="font-mono uppercase text-cinema-white leading-tight mb-5"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '-0.02em', perspective: '600px' }}
              >
                {p.title}
              </h3>

              {/* Body */}
              <p
                data-body
                className="text-cinema-silver/60 font-mono text-sm leading-loose max-w-md"
              >
                {p.body}
              </p>

              {/* Large background number */}
              <div
                className="absolute -right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-cinema-white/[0.03] select-none pointer-events-none"
                style={{ fontSize: 'clamp(8rem,18vw,14rem)', lineHeight: 1 }}
              >
                {p.number}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
