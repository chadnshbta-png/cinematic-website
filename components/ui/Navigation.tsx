'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from '@/lib/gsap';

const navItems = ['Network', 'Industries', 'Intelligence', 'Contact'];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 12]);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 80));
    return unsub;
  }, [scrollY]);

  return (
    <>
      <motion.nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6"
        style={{
          backdropFilter: `blur(${navBlur}px)`,
        }}
      >
        <motion.div
          className="absolute inset-0 bg-cinema-black/80 border-b border-white/5"
          style={{ opacity: navOpacity }}
        />

        <div className="relative max-w-screen-xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-6 h-6 relative">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#E8622A" strokeWidth="1" />
                <path d="M7 12h10M12 7v10" stroke="#E8622A" strokeWidth="1" />
                <circle cx="12" cy="12" r="2" fill="#E8622A" />
              </svg>
            </div>
            <span className="text-cinema-white text-sm font-mono tracking-cinema uppercase">
              DSV
            </span>
          </motion.div>

          {/* Desktop nav items */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden md:flex items-center gap-10"
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-cinema-silver/70 hover:text-cinema-white text-[11px] font-mono tracking-widest uppercase transition-colors duration-300 relative group"
                whileHover={{ y: -1 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white/40 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden md:flex items-center gap-6"
          >
            <a
              href="#contact"
              className="text-[11px] font-mono tracking-widest uppercase text-cinema-black bg-cinema-orange px-5 py-2.5 hover:bg-cinema-orange-bright transition-colors duration-300"
            >
              Configure
            </a>
          </motion.div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <motion.span
              className="block w-6 h-px bg-cinema-white"
              animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="block w-4 h-px bg-cinema-white"
              animate={menuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
            />
            <motion.span
              className="block w-6 h-px bg-cinema-white"
              animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        className="fixed inset-0 z-40 bg-cinema-black flex flex-col items-center justify-center md:hidden"
        initial={{ opacity: 0, pointerEvents: 'none' }}
        animate={menuOpen ? { opacity: 1, pointerEvents: 'auto' } : { opacity: 0, pointerEvents: 'none' }}
        transition={{ duration: 0.4 }}
      >
        {navItems.map((item, i) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-cinema-white text-4xl font-mono tracking-wide uppercase py-4"
            initial={{ y: 30, opacity: 0 }}
            animate={menuOpen ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </motion.a>
        ))}
      </motion.div>
    </>
  );
}
