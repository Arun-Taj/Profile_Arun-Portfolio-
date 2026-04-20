/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-cyan':   '#00f5ff',
        'neon-purple': '#7c3aed',
        'neon-pink':   '#f72585',
        'neon-green':  '#39ff14',
        'bg-primary':  '#050508',
        'bg-secondary':'#0d0d1a',
        'bg-card':     '#0f0f1e',
        'bg-card-hover':'#141428',
        'text-primary':'#f0f4ff',
        'text-secondary':'#94a3b8',
        'text-muted':  '#475569',
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
        body:    ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00f5ff, #7c3aed)',
        'gradient-purple':'linear-gradient(135deg, #7c3aed, #f72585)',
        'gradient-card': 'linear-gradient(135deg, rgba(0,245,255,0.05), rgba(124,58,237,0.05))',
      },
      boxShadow: {
        'neon':   '0 0 20px rgba(0,245,255,0.3)',
        'purple': '0 0 20px rgba(124,58,237,0.3)',
        'card':   '0 8px 32px rgba(0,0,0,0.6)',
      },
      animation: {
        'blink':  'blink 1s step-end infinite',
        'float':  'float 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
