import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050807',
        forest: '#081210',
        moss: '#0e1b16',
        moss2: '#14241d',
        cream: '#f5efe6',
        amber: '#e3a575',
        gold: '#f6d6ac',
      },
      fontFamily: {
        serif: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: { wrap: '1220px' },
      transitionTimingFunction: { cine: 'cubic-bezier(.19,1,.22,1)' },
    },
  },
  plugins: [],
};

export default config;
