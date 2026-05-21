'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import SplitType from 'split-type';

/* ─── Globe canvas — monochrome with mouse parallax ──────────────────────── */
function NetworkGlobe({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let t = 0;
    let mouseX = 0, mouseY = 0;
    let targetMX = 0, targetMY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMX = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetMY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    interface Node {
      theta: number; phi: number;
      x: number; y: number; z: number;
      dPhi: number; phase: number;
    }

    const NODE_COUNT = 160;
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi:   Math.acos(2 * Math.random() - 1),
      x: 0, y: 0, z: 0,
      dPhi:  0.00015 + Math.random() * 0.0003,
      phase: Math.random() * Math.PI * 2,
    }));

    function draw() {
      const W  = canvas!.width;
      const H  = canvas!.height;
      const cx = W / 2;
      const cy = H / 2;
      const R  = Math.min(W, H) * 0.44; // larger globe

      ctx!.clearRect(0, 0, W, H);
      t += 0.003;

      // Lerp mouse
      mouseX += (targetMX - mouseX) * 0.04;
      mouseY += (targetMY - mouseY) * 0.04;

      const rotY = t * 0.35 + mouseX * 0.4;
      const rotX = Math.sin(t * 0.15) * 0.2 + mouseY * 0.2;
      const sinRx = Math.sin(rotX), cosRx = Math.cos(rotX);

      nodes.forEach(n => {
        n.phi += n.dPhi;
        const sinPhi = Math.sin(n.phi), cosPhi = Math.cos(n.phi);
        const sinTh  = Math.sin(n.theta + rotY), cosTh = Math.cos(n.theta + rotY);
        const x0 = sinPhi * sinTh, y0 = cosPhi, z0 = sinPhi * cosTh;
        n.x = x0;
        n.y = y0 * cosRx - z0 * sinRx;
        n.z = y0 * sinRx + z0 * cosRx;
      });

      const fov = W * 0.7;
      const project = (n: Node) => {
        const d = fov / (fov + n.z * R * 0.7);
        return { px: cx + n.x * R * d, py: cy + n.y * R * d, d };
      };

      const sorted = [...nodes].sort((a, b) => a.z - b.z);

      // Connections — white/silver monochrome
      sorted.forEach((a, i) => {
        sorted.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
          if (dist > 0.42) return;
          const pa = project(a), pb = project(b);
          const depth = (a.z + b.z) / 2 + 0.5;
          const alpha = (1 - dist / 0.42) * 0.22 * depth;
          ctx!.beginPath();
          ctx!.moveTo(pa.px, pa.py);
          ctx!.lineTo(pb.px, pb.py);
          ctx!.strokeStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        });
      });

      // Nodes — white dots with soft halo
      sorted.forEach(n => {
        const p = project(n);
        const pulse = Math.sin(t * 2 + n.phase) * 0.4 + 0.6;
        const depth = (n.z + 1) / 2;
        const alpha = depth * 0.85;
        const r = 1.4 + pulse * 1.1;

        // Halo
        const grad = ctx!.createRadialGradient(p.px, p.py, 0, p.px, p.py, r * 5);
        grad.addColorStop(0, `rgba(255,255,255,${alpha * 0.3})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx!.beginPath();
        ctx!.arc(p.px, p.py, r * 5, 0, Math.PI * 2);
        ctx!.fillStyle = grad;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(p.px, p.py, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx!.fill();
      });

      // Subtle equator ellipse
      ctx!.beginPath();
      ctx!.ellipse(cx, cy, R, R * 0.1, 0, 0, Math.PI * 2);
      ctx!.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx!.lineWidth = 1;
      ctx!.stroke();

      raf = requestAnimationFrame(draw);
    }

    const resize = () => {
      canvas!.width  = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [canvasRef]);

  return null;
}

/* ─── Mouse-reactive background particles ────────────────────────────────── */
function BackgroundParticles({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;

    let raf: number;
    let t = 0;
    let mx = 0.5, my = 0.5;
    let tmx = 0.5, tmy = 0.5;

    const onMove = (e: MouseEvent) => {
      tmx = e.clientX / window.innerWidth;
      tmy = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    interface Particle {
      x: number; y: number; r: number;
      baseX: number; baseY: number;
      parallaxDepth: number; phase: number;
    }

    const PCOUNT = 60;
    const particles: Particle[] = Array.from({ length: PCOUNT }, () => ({
      baseX: Math.random(),
      baseY: Math.random(),
      x: 0, y: 0,
      r: 0.3 + Math.random() * 1.2,
      parallaxDepth: 0.02 + Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2,
    }));

    function draw() {
      const W = canvas.width, H = canvas.height;
      mx += (tmx - mx) * 0.03;
      my += (tmy - my) * 0.03;
      t += 0.008;

      ctx.clearRect(0, 0, W, H);

      particles.forEach(p => {
        const offsetX = (mx - 0.5) * p.parallaxDepth * W;
        const offsetY = (my - 0.5) * p.parallaxDepth * H;
        const floatY  = Math.sin(t * 0.4 + p.phase) * 8;

        p.x = p.baseX * W + offsetX;
        p.y = p.baseY * H + offsetY + floatY;

        const alpha = 0.3 + Math.sin(t * 0.8 + p.phase) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      // Subtle flowing lines
      for (let i = 0; i < 6; i++) {
        const y = H * (0.15 + i * 0.13);
        const offsetY = (my - 0.5) * (0.01 + i * 0.005) * H;
        const amp = 20 + i * 8;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const yy = y + offsetY + Math.sin(x * 0.003 + t * 0.3 + i) * amp;
          if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
        }
        ctx.strokeStyle = `rgba(255,255,255,${0.018 - i * 0.002})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    const resize = () => {
      canvas.width  = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [containerRef]);

  return null;
}

/* ─── Section ─────────────────────────────────────────────────────────────── */
export default function ParallaxSection() {
  const sectionRef      = useRef<HTMLDivElement>(null);
  const videoWrapRef    = useRef<HTMLDivElement>(null);
  const videoRef        = useRef<HTMLVideoElement>(null);
  const globeSectionRef = useRef<HTMLDivElement>(null);
  const globeCanvasRef  = useRef<HTMLCanvasElement>(null);
  const headingRef      = useRef<HTMLHeadingElement>(null);
  const taglineRef      = useRef<HTMLParagraphElement>(null);
  const globeParticleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section     = sectionRef.current;
    const videoWrap   = videoWrapRef.current;
    const globeSection = globeSectionRef.current;
    if (!section || !videoWrap || !globeSection) return;

    if (videoRef.current) videoRef.current.play().catch(() => {});

    // ── Video: slower-than-scroll parallax (semi-fixed feel) ──
    gsap.to(videoWrap, {
      y: () => window.innerHeight * 0.45,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '80% top',
        scrub: true,
      },
    });

    // ── Globe section: SLIDE UP from below (cinematic reveal) ──
    gsap.fromTo(globeSection,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: section,
          start: '50% top',
          end: '80% top',
          scrub: 1.2,
        },
      }
    );

    // Heading 3D reveal
    if (headingRef.current) {
      const split = new SplitType(headingRef.current, { types: 'chars' });
      gsap.fromTo(split.chars,
        { y: 80, opacity: 0, rotateX: -70, filter: 'blur(8px)', transformOrigin: '50% 100%' },
        {
          y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)',
          duration: 1.4, stagger: 0.04, ease: 'power4.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 75%' },
        }
      );
    }

    if (taglineRef.current) {
      gsap.fromTo(taglineRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: taglineRef.current, start: 'top 80%' },
        }
      );
    }

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll()
        .filter(s => s.vars.trigger instanceof Element
          && (s.vars.trigger as Element).closest?.('#titan-parallax'))
        .forEach(s => s.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="titan-parallax"
      className="relative bg-cinema-black"
      style={{ minHeight: '200vh' }}
    >
      {/* ── Semi-fixed video panel (Titan Series) ── */}
      <div
        ref={videoWrapRef}
        className="absolute top-0 left-0 right-0 h-screen overflow-hidden"
        style={{ willChange: 'transform' }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/video/mp_ (4).mp4"
          muted
          loop
          playsInline
          preload="metadata"
        />

        {/* Monochrome overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(7,7,7,0.25) 0%, rgba(7,7,7,0.5) 55%, rgba(7,7,7,1) 100%)',
            mixBlendMode: 'multiply',
          }}
        />
        <div className="absolute inset-0 bg-cinema-black/30" />

        {/* Cinematic text */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-8">
          <div>
            <div className="flex items-center gap-3 justify-center mb-5">
              <div className="w-5 h-px bg-white/25" />
              <span className="text-white/35 text-[10px] font-mono tracking-ultra uppercase">
                Titan Series
              </span>
              <div className="w-5 h-px bg-white/25" />
            </div>

            <h2
              ref={headingRef}
              className="font-mono uppercase text-white leading-none"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 6.5rem)',
                letterSpacing: '-0.02em',
                perspective: '900px',
              }}
            >
              Connected to
              <br />
              Every Terrain
            </h2>

            <p ref={taglineRef} className="text-white/30 font-mono text-sm mt-6 max-w-md mx-auto leading-relaxed">
              Global telemetry. Adaptive intelligence. Zero blind spots.
            </p>
          </div>
        </div>

        {/* Letterbox */}
        <div className="absolute top-0 inset-x-0 h-10 bg-cinema-black pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-10 bg-cinema-black pointer-events-none" />
      </div>

      {/* ── Globe section — slides up over the video ── */}
      <div
        ref={globeSectionRef}
        className="absolute bottom-0 left-0 right-0 bg-cinema-black overflow-hidden"
        style={{ height: '100vh', clipPath: 'inset(100% 0% 0% 0%)' }}
      >
        {/* Mouse-reactive background particles */}
        <div ref={globeParticleRef} className="absolute inset-0">
          <BackgroundParticles containerRef={globeParticleRef} />
        </div>

        {/* Globe canvas — white/silver monochrome */}
        <canvas
          ref={globeCanvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.85 }}
        />
        <NetworkGlobe canvasRef={globeCanvasRef} />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="w-5 h-px bg-white/20" />
            <span className="text-white/30 text-[10px] font-mono tracking-ultra uppercase">
              TOS — Live Network
            </span>
            <div className="w-5 h-px bg-white/20" />
          </div>

          <h3
            className="font-mono uppercase text-white leading-none mb-3"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', letterSpacing: '-0.01em' }}
          >
            1,247 Active Units
          </h3>

          <p className="text-white/25 font-mono text-sm tracking-wider">
            Real-time telemetry across 6 continents
          </p>

          <div className="mt-14 flex items-center gap-14">
            {[
              { label: 'Countries',  value: '47'     },
              { label: 'Avg Range',  value: '820km'  },
              { label: 'Uptime',     value: '99.97%' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-white/80 font-mono text-2xl mb-1">{s.value}</p>
                <p className="text-white/25 text-[9px] font-mono tracking-widest uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top gradient */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cinema-black to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cinema-black to-transparent pointer-events-none" />
      </div>

    </section>
  );
}
