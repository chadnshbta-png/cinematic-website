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
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const rafRef = useRef<number>(0);
  const isReadyRef = useRef(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

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
      ctxRef.current = canvas.getContext('2d', { alpha: false }) ?? null;
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    const { width, height } = canvas;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const canvasAspect = width / height;
    const imgAspect = iw / ih;

    let dw: number, dh: number, dx: number, dy: number;
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

    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawnFrameRef.current = index;
  }, [canvasRef]);

  // Separate high-frequency render loop — decoupled from scroll events
  useEffect(() => {
    const loop = () => {
      if (isReadyRef.current) {
        const diff = targetProgressRef.current - currentProgressRef.current;

        // Only draw if there's meaningful change
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

        // Unlock render loop as soon as first batch loaded
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

    // Load first 40 frames immediately (priority)
    for (let i = 0; i < Math.min(40, paths.length); i++) loadFrame(i);

    // Load rest with a small delay to not block main thread
    const raf = requestAnimationFrame(() => {
      for (let i = 40; i < paths.length; i++) loadFrame(i);
    });

    return () => cancelAnimationFrame(raf);
  }, [drawFrame]);

  // Resize — maintain canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctxRef.current = null; // reset ctx cache after resize
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
