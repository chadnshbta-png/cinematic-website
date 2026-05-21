import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './sections/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cinema-black':   '#080808',
        'cinema-dark':    '#0f0f0f',
        'cinema-charcoal':'#1a1a1a',
        'cinema-ash':     '#2a2a2a',
        'cinema-silver':  '#8A9BA8',
        'cinema-steel':   '#6B7A84',
        'cinema-white':   '#F0EEE9',
        'cinema-fog':     'rgba(240,238,233,0.06)',
        // Kept for CTAs / interactive accents only
        'cinema-orange':       '#E8622A',
        'cinema-orange-bright':'#FF7A3D',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        'cinema': '0.25em',
        'ultra': '0.5em',
      },
      animation: {
        'fade-in': 'fadeIn 1.2s ease forwards',
        'slide-up': 'slideUp 0.8s ease forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'particle-float': 'particleFloat 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,255,255,0.06)' },
          '50%': { boxShadow: '0 0 60px rgba(255,255,255,0.12)' },
        },
        particleFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(120deg)' },
          '66%': { transform: 'translateY(10px) rotate(240deg)' },
        },
      },
      backgroundImage: {
        'cinema-gradient': 'linear-gradient(180deg, #080808 0%, #0f0f0f 50%, #080808 100%)',
        'silver-glow': 'radial-gradient(ellipse at center, rgba(138,155,168,0.15) 0%, transparent 70%)',
        'vignette': 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.9) 100%)',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
    },
  },
  plugins: [],
};

export default config;
