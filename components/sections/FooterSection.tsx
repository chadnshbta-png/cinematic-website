'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

const footerLinks = {
  Fleet: ['DSV X', 'DSV Pro', 'DSV Sprint', 'DSV Electric'],
  Company: ['Our Story', 'Heritage', 'Careers', 'Press'],
  Support: ['Configure', 'Dealerships', 'Service', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Cookies', 'Sitemap'],
};

export default function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const logoEl = section.querySelector('.footer-logo');
    if (logoEl) {
      gsap.fromTo(
        logoEl,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: logoEl,
            start: 'top 85%',
          },
        }
      );
    }

    const linkCols = section.querySelectorAll('[data-link-col]');
    gsap.fromTo(
      linkCols,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: linkCols[0],
          start: 'top 85%',
        },
      }
    );
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative bg-cinema-black border-t border-white/5 overflow-hidden"
      id="contact"
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="footer-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      {/* Large brand watermark */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center overflow-hidden pointer-events-none">
        <div
          className="footer-logo font-mono uppercase text-cinema-white/[0.025] leading-none select-none"
          style={{ fontSize: 'clamp(8rem, 20vw, 20rem)', letterSpacing: '-0.04em' }}
        >
          DSV
        </div>
      </div>

      {/* Newsletter / CTA strip */}
      <div className="relative border-b border-white/5 py-20 px-8 md:px-20">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="text-white/35 text-[10px] font-mono tracking-ultra uppercase mb-3">
              Stay Informed
            </p>
            <h3
              className="font-mono uppercase text-cinema-white"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}
            >
              First to Know.
              <br />
              First to Drive.
            </h3>
          </div>
          <div className="flex items-stretch gap-0 w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="bg-transparent border border-white/10 px-6 py-4 text-cinema-white text-[11px] font-mono placeholder:text-cinema-silver/30 focus:outline-none focus:border-white/40 transition-colors duration-300 w-full md:w-72"
            />
            <button className="bg-cinema-orange text-cinema-black text-[11px] font-mono tracking-widest uppercase px-8 py-4 hover:bg-cinema-orange-bright transition-colors duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="relative max-w-screen-xl mx-auto px-8 md:px-20 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                <path d="M9 16h14M16 9v14" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                <circle cx="16" cy="16" r="3" fill="rgba(255,255,255,0.6)" />
              </svg>
              <span className="text-cinema-white font-mono text-sm tracking-cinema uppercase">DSV</span>
            </div>
            <p className="text-cinema-silver/40 font-mono text-[11px] leading-relaxed max-w-xs">
              Redefining global logistics since 1976. The future of supply chain intelligence.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} data-link-col>
              <h4 className="text-cinema-white/40 text-[10px] font-mono tracking-ultra uppercase mb-6">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-cinema-silver/50 hover:text-cinema-white text-[11px] font-mono transition-colors duration-300 relative group"
                    >
                      {link}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/35 group-hover:w-full transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cinema-silver/20 text-[10px] font-mono">
            © 2025 DSV Global Logistics. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['IG', 'YT', 'X', 'LI'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-cinema-silver/30 hover:text-cinema-white text-[11px] font-mono tracking-widest transition-colors duration-300"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
