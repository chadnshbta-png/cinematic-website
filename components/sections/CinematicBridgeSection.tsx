'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import SplitType from 'split-type';

/* ─── Monochrome abstract canvas atmosphere ─────────────────────────────── */
function AbstractAtmosphere({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf: number;
    let t = 0;

    interface Orb {
      x: number; y: number; r: number;
      vx: number; vy: number;
      opacity: number; phase: number;
    }
    const orbs: Orb[] = Array.from({ length: 10 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.12 + Math.random() * 0.18,
      vx: (Math.random() - 0.5) * 0.00015,
      vy: (Math.random() - 0.5) * 0.00015,
      opacity: 0.03 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
    }));

    function draw() {
      const W = canvas!.width;
      const H = canvas!.height;
      t += 0.004;
      ctx!.clearRect(0, 0, W, H);

      const NUM_CURVES = 14;
      for (let i = 0; i < NUM_CURVES; i++) {
        const baseY = H * ((i + 0.5) / NUM_CURVES);
        const amp   = 60 + i * 8;
        const freq  = 0.002 + i * 0.0004;
        const speed = 0.18 + i * 0.04;
        const alpha = 0.008 + (i % 3) * 0.006;

        ctx!.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const y = baseY
            + Math.sin(x * freq + t * speed + i * 1.2) * amp
            + Math.cos(x * freq * 0.5 + t * speed * 0.7 + i) * (amp * 0.4);
          if (x === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx!.lineWidth = 0.8;
        ctx!.stroke();
      }

      orbs.forEach(o => {
        o.x += o.vx + Math.sin(t * 0.3 + o.phase) * 0.0001;
        o.y += o.vy + Math.cos(t * 0.2 + o.phase) * 0.0001;
        if (o.x < -0.1) o.x = 1.1;
        if (o.x > 1.1)  o.x = -0.1;
        if (o.y < -0.1) o.y = 1.1;
        if (o.y > 1.1)  o.y = -0.1;

        const pulse  = Math.sin(t * 0.8 + o.phase) * 0.3 + 0.7;
        const cx = o.x * W, cy = o.y * H;
        const radius = o.r * Math.min(W, H) * pulse;

        const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, radius);
        g.addColorStop(0, `rgba(255,255,255,${o.opacity * pulse})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx!.beginPath();
        ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx!.fillStyle = g;
        ctx!.fill();
      });

      for (let i = 0; i < 5; i++) {
        const x1 = Math.sin(t * 0.1 + i) * W * 0.5 + W * 0.5;
        const x2 = Math.cos(t * 0.07 + i * 1.3) * W * 0.5 + W * 0.5;
        const y1 = i * (H / 5), y2 = (i + 1) * (H / 5);
        ctx!.beginPath();
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.strokeStyle = 'rgba(255,255,255,0.025)';
        ctx!.lineWidth = 0.6;
        ctx!.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    const resize = () => { canvas!.width = canvas!.offsetWidth; canvas!.height = canvas!.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef]);

  return null;
}

/* ─── Bridge Section ─────────────────────────────────────────────────────── */
export default function CinematicBridgeSection() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const line1Ref     = useRef<HTMLDivElement>(null);
  const line2Ref     = useRef<HTMLDivElement>(null);
  const taglineRef   = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const dividorRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // ── "Forged to / Dominate" entrance — fires once section enters ──
    const onEnter = () => {
      const tl = gsap.timeline();

      if (eyebrowRef.current) {
        const s = new SplitType(eyebrowRef.current, { types: 'chars' });
        tl.fromTo(s.chars,
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.03, ease: 'power2.out' },
          0
        );
      }

      if (line1Ref.current) {
        const s1 = new SplitType(line1Ref.current, { types: 'chars' });
        gsap.set(line1Ref.current, { perspective: 900 });
        tl.fromTo(s1.chars,
          { opacity: 0, rotateX: -80, y: 50, z: -100, filter: 'blur(8px)', transformOrigin: '50% 100% -40px' },
          { opacity: 1, rotateX: 0, y: 0, z: 0, filter: 'blur(0px)', duration: 1.5, stagger: { each: 0.055, ease: 'power2.in' }, ease: 'power4.out' },
          0.15
        );
      }

      if (line2Ref.current) {
        const s2 = new SplitType(line2Ref.current, { types: 'chars' });
        gsap.set(line2Ref.current, { perspective: 900 });
        tl.fromTo(s2.chars,
          { opacity: 0, rotateX: -65, y: 40, z: -80, filter: 'blur(6px)', transformOrigin: '50% 100% -30px' },
          { opacity: 1, rotateX: 0, y: 0, z: 0, filter: 'blur(0px)', duration: 1.4, stagger: { each: 0.05, ease: 'power2.in' }, ease: 'power4.out' },
          0.55
        );
      }

      if (dividorRef.current) {
        tl.fromTo(dividorRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power3.out', transformOrigin: 'left' }, 0.9);
      }

      if (taglineRef.current) {
        const s3 = new SplitType(taglineRef.current, { types: 'words' });
        tl.fromTo(s3.words, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power2.out' }, 1.1);
      }
    };

    ScrollTrigger.create({ trigger: section, start: 'top 85%', once: true, onEnter });

    // ── Scroll-reactive text illumination (gray → white) ──
    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'top 10%',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        if (line1Ref.current)   gsap.set(line1Ref.current,   { color: `rgba(255,255,255,${0.28 + p * 0.62})` });
        if (line2Ref.current)   gsap.set(line2Ref.current,   { color: `rgba(224,224,224,${0.22 + p * 0.68})` });
        if (taglineRef.current) gsap.set(taglineRef.current, { color: `rgba(255,255,255,${0.1  + p * 0.3})` });
      },
    });

    // Subtle vertical parallax on canvas
    gsap.to(canvasRef.current, {
      y: () => -window.innerHeight * 0.15,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter(s => s.vars.trigger instanceof Element
          && (s.vars.trigger as Element).closest?.('#bridge-section'))
        .forEach(s => s.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="bridge-section"
      className="relative bg-cinema-black overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Top gradient — seamless join with hero's bridge panel */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-cinema-black to-transparent z-10 pointer-events-none" />

      {/* Abstract monochrome canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }} />
      <AbstractAtmosphere canvasRef={canvasRef} />

      {/* Deep vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(7,7,7,0.7) 70%, rgba(7,7,7,0.97) 100%)' }}
      />

      {/* ── Content — "Forged to Dominate" ── */}
      <div className="relative z-10 flex flex-col justify-center px-8 md:px-20" style={{ minHeight: '100vh' }}>
        <div className="max-w-5xl pt-32">
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="flex items-center gap-4 mb-8 opacity-0">
            <div className="w-6 h-px bg-white/30" />
            <span className="text-white/40 text-[10px] font-mono tracking-ultra uppercase">
              DSV X — 2025
            </span>
          </div>

          {/* Line 1 */}
          <div
            ref={line1Ref}
            className="font-mono uppercase leading-none mb-2 opacity-0"
            style={{
              fontSize: 'clamp(2.5rem, 7.5vw, 8rem)',
              letterSpacing: '-0.025em',
              color: 'rgba(255,255,255,0.28)',
              transformStyle: 'preserve-3d',
            }}
          >
            Forged to
          </div>

          {/* Line 2 */}
          <div
            ref={line2Ref}
            className="font-mono uppercase leading-none mb-12 opacity-0"
            style={{
              fontSize: 'clamp(2.5rem, 7.5vw, 8rem)',
              letterSpacing: '-0.025em',
              color: 'rgba(224,224,224,0.22)',
              transformStyle: 'preserve-3d',
            }}
          >
            Dominate
          </div>

          {/* Divider */}
          <div
            ref={dividorRef}
            className="w-16 h-px bg-white/25 mb-8 origin-left"
            style={{ transform: 'scaleX(0)' }}
          />

          {/* Tagline */}
          <p
            ref={taglineRef}
            className="font-mono text-base leading-loose max-w-xl opacity-0"
            style={{ color: 'rgba(255,255,255,0.1)' }}
          >
            1,200 horsepower. Adaptive intelligence. Carbon-composite chassis.
            <br />
            The machine that redefines every standard it encounters.
          </p>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-cinema-black to-transparent pointer-events-none" />
    </section>
  );
}
