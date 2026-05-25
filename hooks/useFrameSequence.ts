'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { generateFramePaths, FRAME_COUNT } from '@/utils/frameUtils';

export interface FrameSequenceState {
  loadedCount: number;
  totalFrames: number;
  isReady: boolean;
  progress: number;
}

// Lerp factor — lower = smoother/slower catch-up, higher = snappier
const LERP_FACTOR = 0.1;

export function useFrameSequence(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const imagesRef          = useRef<(HTMLImageElement | null)[]>([]);
  const targetProgressRef  = useRef(0);
  const currentProgressRef = useRef(0);
  const lastDrawnFrameRef  = useRef(-1);
  const rafRef             = useRef<number>(0);
  const isReadyRef         = useRef(false);
  const ctxRef             = useRef<CanvasRenderingContext2D | null>(null);
  // Tracks portrait/mobile mode — set in resize handler before any drawFrame call
  const isMobileRef        = useRef(false);

  const [state, setState] = useState<FrameSequenceState>({
    loadedCount: 0,
    totalFrames: FRAME_COUNT,
    isReady: false,
    progress: 0,
  });

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = imagesRef.current[index];
    if (!img?.complete || !img.naturalWidth) return;

    if (!ctxRef.current) {
      const ctx = canvas.getContext('2d', { alpha: false }) ?? null;
      if (ctx) {
        ctx.imageSmoothingEnabled  = true;
        // Lower quality tier on mobile reduces CPU per draw without visible difference
        ctx.imageSmoothingQuality  = isMobileRef.current ? 'medium' : 'high';
      }
      ctxRef.current = ctx;
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    const { width, height } = canvas;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    let dw: number, dh: number, dx: number, dy: number;

    if (isMobileRef.current) {
      // ── Mobile: soft-cover hybrid ─────────────────────────────────────────
      //
      // The frames are landscape (≈16:9). On a portrait phone a full-cover
      // scale produces 3–4× zoom and severe cropping that hides the subject.
      //
      // Strategy:
      //   1. Scale so the image fills the viewport WIDTH exactly.
      //   2. If that scale doesn't reach 60 % of viewport HEIGHT, scale up to
      //      that threshold instead (so the composition is never a tiny strip).
      //   3. Center symmetrically → the uncovered top/bottom become narrow
      //      letterbox bars (~20 % each) that are already hidden by the
      //      hero's CSS gradient overlays (top h-32, bottom 40vh).
      //
      // Result: ~2× zoom instead of ~4×. The full image height is always
      // visible. Only the extreme left/right edges are softly cropped.
      const scaleW  = width  / iw;
      const scaleH  = (height * 0.60) / ih;
      const scale   = Math.max(scaleW, scaleH);

      dw = iw * scale;
      dh = ih * scale;
      dx = (width  - dw) / 2;
      dy = (height - dh) / 2;

      // Fill letterbox areas with the hero background colour before drawing
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, width, height);
    } else {
      // ── Desktop: full cover ───────────────────────────────────────────────
      // Image always fills the canvas completely — no letterbox.
      const canvasAspect = width / height;
      const imgAspect    = iw / ih;

      if (canvasAspect > imgAspect) {
        dw = width;
        dh = width / imgAspect;
        dx = 0;
        dy = (height - dh) / 2;
      } else {
        dw = height * imgAspect;
        dh = height;
        dx = (width - dw) / 2;
        dy = 0;
      }
    }

    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawnFrameRef.current = index;
  }, [canvasRef]);

  // High-frequency render loop — decoupled from scroll events
  useEffect(() => {
    const loop = () => {
      if (isReadyRef.current) {
        const diff = targetProgressRef.current - currentProgressRef.current;

        if (Math.abs(diff) > 0.00005) {
          currentProgressRef.current += diff * LERP_FACTOR;

          const rawFrame = currentProgressRef.current * (FRAME_COUNT - 1);
          const frameIdx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(rawFrame)));

          if (frameIdx !== lastDrawnFrameRef.current) {
            drawFrame(frameIdx);
          }
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFrame]);

  // Batch-preload frames — prioritize early frames first
  useEffect(() => {
    const paths = generateFramePaths();
    imagesRef.current = new Array(paths.length).fill(null);
    let loadedCount = 0;
    let firstBatchDone = false;

    const loadFrame = (idx: number) => {
      const img = new Image();
      img.decoding = 'async';

      img.onload = () => {
        imagesRef.current[idx] = img;
        loadedCount++;
        const progress = loadedCount / paths.length;

        if (!firstBatchDone && loadedCount >= Math.min(20, paths.length)) {
          firstBatchDone = true;
          isReadyRef.current = true;
          drawFrame(0);
        }

        setState(prev => ({
          ...prev,
          loadedCount,
          progress,
          isReady: loadedCount === paths.length,
        }));
      };

      img.onerror = () => {
        loadedCount++;
        const progress = loadedCount / paths.length;
        setState(prev => ({ ...prev, loadedCount, progress, isReady: loadedCount === paths.length }));
      };

      img.src = paths[idx];
    };

    for (let i = 0; i < Math.min(40, paths.length); i++) loadFrame(i);

    const raf = requestAnimationFrame(() => {
      for (let i = 40; i < paths.length; i++) loadFrame(i);
    });

    return () => cancelAnimationFrame(raf);
  }, [drawFrame]);

  // Resize — isMobileRef and DPR are set here before drawFrame is called
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      // Portrait or narrow viewport → mobile strategy
      isMobileRef.current = window.innerWidth < 768 || window.innerHeight > window.innerWidth;

      // Lower DPR cap on mobile keeps canvas buffer size manageable
      const dpr = Math.min(window.devicePixelRatio, isMobileRef.current ? 1.5 : 2);

      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      // Null out ctx so next drawFrame re-acquires it with the correct
      // imageSmoothingQuality for the current device class
      ctxRef.current = null;

      const frameIdx = Math.max(0, Math.min(FRAME_COUNT - 1,
        Math.round(currentProgressRef.current * (FRAME_COUNT - 1))));
      drawFrame(frameIdx);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [canvasRef, drawFrame]);

  // The only public setter — called by ScrollTrigger
  const setProgress = useCallback((progress: number) => {
    targetProgressRef.current = Math.max(0, Math.min(1, progress));
  }, []);

  return { setProgress, state };
}
