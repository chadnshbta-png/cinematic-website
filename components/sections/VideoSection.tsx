'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';
import SplitType from 'split-type';

export default function VideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Section entrance from darkness
    ScrollTrigger.create({
      trigger: section,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(section, { opacity: 1, duration: 1.5, ease: 'power2.out' });
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      },
    });

    // Parallax video scale
    gsap.fromTo(
      videoRef.current,
      { scale: 1.15 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    // Mask reveal for the second video
    if (maskRef.current) {
      gsap.fromTo(
        maskRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.5,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: maskRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Text reveals
    if (textRef.current) {
      const textElements = textRef.current.querySelectorAll('[data-reveal]');
      textElements.forEach((el, i) => {
        const split = new SplitType(el as HTMLElement, { types: 'lines' });
        gsap.fromTo(
          split.lines,
          { y: 60, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.2,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }

    // Label counter
    if (labelRef.current) {
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: labelRef.current,
            start: 'top 85%',
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-cinema-black opacity-0"
      id="heritage"
    >
      {/* Full-bleed video hero */}
      <div className="relative w-full h-screen overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-110"
          src="/video/Ultra_realistic_cinematic_comm.mp4"
          muted
          loop
          playsInline
          preload="metadata"
        />

        {/* Overlay layers */}
        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.2) 50%, rgba(8,8,8,0.8) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cinema-black via-transparent to-cinema-black" />

        {/* Cinematic letterbox bars */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-cinema-black" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-cinema-black" />

        {/* Video section text */}
        <div ref={textRef} className="absolute inset-0 flex flex-col justify-center px-8 md:px-24">
          <div ref={labelRef} className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-cinema-orange" />
            <span className="text-cinema-orange text-[10px] font-mono tracking-ultra uppercase">
              The Standard
            </span>
          </div>

          <h2
            data-reveal
            className="text-cinema-white font-mono uppercase leading-none mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', letterSpacing: '-0.02em' }}
          >
            Engineered for
            <br />
            <span className="text-cinema-orange">the Extreme</span>
          </h2>

          <p
            data-reveal
            className="text-cinema-silver/80 text-lg font-mono leading-relaxed max-w-lg"
          >
            1,200 horsepower. Zero compromise.
            <br />
            Crafted in the finest tradition of performance engineering.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-end gap-2 opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-px bg-cinema-orange"
              style={{ width: `${20 + i * 8}px`, opacity: 1 - i * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Split layout: stat + second video */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[60vh]">
        {/* Left: Large stats */}
        <div className="relative flex flex-col justify-center px-8 md:px-16 py-24 bg-cinema-dark border-r border-white/5">
          <div className="mb-6">
            <span className="text-cinema-orange text-[10px] font-mono tracking-ultra uppercase">
              Power Output
            </span>
          </div>
          <div
            data-reveal
            className="text-cinema-white font-mono leading-none mb-4"
            style={{ fontSize: 'clamp(5rem, 12vw, 10rem)', letterSpacing: '-0.04em' }}
          >
            1,200
          </div>
          <p className="text-cinema-silver/60 text-sm font-mono tracking-widest uppercase">
            Horsepower — V12 Hybrid
          </p>

          <div className="mt-16 grid grid-cols-2 gap-8">
            {[
              { label: 'Torque', value: '1,850', unit: 'Nm' },
              { label: '0–100', value: '3.8', unit: 's' },
              { label: 'Payload', value: '2,400', unit: 'kg' },
              { label: 'Range', value: '820', unit: 'km' },
            ].map(({ label, value, unit }) => (
              <div key={label} className="border-l border-cinema-orange/20 pl-4">
                <div className="text-cinema-orange text-[10px] font-mono tracking-widest uppercase mb-1">
                  {label}
                </div>
                <div className="text-cinema-white font-mono text-2xl">
                  {value}
                  <span className="text-cinema-silver/60 text-sm ml-1">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Second video with mask */}
        <div ref={maskRef} className="relative overflow-hidden min-h-[50vh]">
          <video
            ref={video2Ref}
            className="absolute inset-0 w-full h-full object-cover"
            src="/video/Ultra_realistic_cinematic_comm (1).mp4"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-cinema-black/40" />

          {/* Overlay text */}
          <div className="absolute bottom-8 left-8">
            <p className="text-cinema-white/60 text-[10px] font-mono tracking-ultra uppercase">
              Cinematic Performance
            </p>
          </div>
        </div>
      </div>

      {/* Third video: Atmospheric wide shot */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/video/mp_ (4).mp4"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-cinema-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-black/60 via-transparent to-cinema-black/60" />

        {/* Centered overlay text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <div className="text-cinema-orange text-[10px] font-mono tracking-ultra uppercase mb-4">
            Titan Series
          </div>
          <h3
            className="text-cinema-white font-mono uppercase"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '0.05em' }}
          >
            Beyond the Horizon
          </h3>
        </div>

        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)',
          }}
        />
      </div>
    </section>
  );
}
