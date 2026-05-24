'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/ui/Navigation';
import Loader from '@/components/ui/Loader';
import { useLenis } from '@/hooks/useLenis';

/* Dynamic imports — all client-only, no SSR */
const HeroSection              = dynamic(() => import('@/components/sections/HeroSection'),              { ssr: false });
const PowerOutputSection       = dynamic(() => import('@/components/sections/PowerOutputSection'),       { ssr: false });
const ScrollStorySection       = dynamic(() => import('@/components/sections/ScrollStorySection'),       { ssr: false });
const YOSSection               = dynamic(() => import('@/components/sections/YOSSection'),               { ssr: false });
const CollectionSection        = dynamic(() => import('@/components/sections/CollectionSection'),        { ssr: false });
const ParallaxSection          = dynamic(() => import('@/components/sections/ParallaxSection'),          { ssr: false });
const StorySection             = dynamic(() => import('@/components/sections/StorySection'),             { ssr: false });
const SpecsSection             = dynamic(() => import('@/components/sections/SpecsSection'),             { ssr: false });
const FooterSection            = dynamic(() => import('@/components/sections/FooterSection'),            { ssr: false });
const CustomCursor             = dynamic(() => import('@/components/ui/CustomCursor'),                   { ssr: false });

export default function Home() {
  const [loadProgress, setLoadProgress]     = useState(0);
  const [isLoaderComplete, setLoaderDone]   = useState(false);

  useLenis();

  const handleLoadProgress = useCallback((progress: number) => {
    setLoadProgress(progress);
  }, []);

  const handleLoadComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  return (
    <>
      <CustomCursor />

      <Loader
        progress={loadProgress}
        isComplete={isLoaderComplete}
        onAnimationComplete={() => {}}
      />

      <main className="relative bg-cinema-black">
        <Navigation />

        {/* ── 1. Hero — 480-frame cinematic scroll sequence ── */}
        <HeroSection
          onLoadProgress={handleLoadProgress}
          onLoadComplete={handleLoadComplete}
        />

        {/* ── 2. Power Output — reversible scrub stats ── */}
        <PowerOutputSection />

        {/* ── 4. Scroll Story — sticky video + progressive copy ── */}
        <ScrollStorySection />

        {/* ── 5. YOS — DIGITAL · SUPPLY · VISION → DSV morph ── */}
        <YOSSection />

        {/* ── 6. Collection — horizontal carousel ── */}
        <CollectionSection />

        {/* ── 7. Parallax — globe network + mouse reactive ── */}
        <ParallaxSection />

        {/* ── 7. Our Story — cinematic timeline ── */}
        <StorySection />

        {/* ── 8. Specs — animated performance numbers ── */}
        <SpecsSection />

        {/* ── 9. Footer ── */}
        <FooterSection />

        {/* Global ambient background glow — monochrome */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
          {[400, 600, 320, 500].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width:  size,
                height: size,
                background: 'radial-gradient(circle, rgba(255,255,255,0.04), transparent)',
                left:   `${[8, 72, 35, 85][i]}%`,
                top:    `${[25, 62, 78, 38][i]}%`,
                transform: 'translate(-50%,-50%)',
                opacity: 1,
                animation: `particleFloat ${12 + i * 4}s ease-in-out infinite`,
                animationDelay: `${i * 2.2}s`,
              }}
            />
          ))}
        </div>
      </main>
    </>
  );
}
