'use client';



import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  progress: number;
  isComplete: boolean;
  onAnimationComplete?: () => void;
}

export default function Loader({ progress, isComplete, onAnimationComplete }: LoaderProps) {

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-cinema-black overflow-hidden"
          exit={{
            opacity: 0,
            scale: 1.05,
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
          }}
          onAnimationComplete={() => {
            if (isComplete) onAnimationComplete?.();
          }}
        >
          {/* Atmospheric grid */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(255,255,255,0.04)' }} />

          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mb-16"
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="rgba(255,255,255,0.7)" strokeWidth="1" opacity="0.4" />
              <circle cx="40" cy="40" r="28" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" opacity="0.2" />
              <path
                d="M20 40 L60 40 M40 20 L40 60"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1"
                opacity="0.6"
              />
              <circle cx="40" cy="40" r="4" fill="rgba(255,255,255,0.7)" />
              <motion.circle
                cx="40"
                cy="40"
                r="38"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="238"
                strokeDashoffset={238 - (progress / 100) * 238}
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
          </motion.div>

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.8em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-cinema-white text-xs font-mono tracking-ultra uppercase mb-2"
          >
            DSV
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-cinema-silver text-[10px] font-mono tracking-widest uppercase mb-16"
          >
            Loading Experience
          </motion.div>

          {/* Progress bar */}
          <div className="relative w-64">
            <div className="h-px bg-white/10 w-full">
              <motion.div
                className="h-full bg-white/60 origin-left"
                style={{ scaleX: progress / 100 }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-cinema-silver/50 text-[10px] font-mono">INITIALIZING</span>
              <span className="text-white/60 text-[10px] font-mono">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
