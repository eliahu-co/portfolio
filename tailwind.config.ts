// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f5f3ef',
        ink: '#1a1a1a',
        'accent-warm': '#c8a84a',
        'accent-cool': '#3a6ea8',
        subtle: '#e0ddd8',
        // Autodesk primary brand palette — used by /HA-DrawingAnalyzer
        'autodesk-blue': '#0696d7',
        charcoal: '#666666',
        // Coin Master (Moon Active) brand palette — used by /MA-HomeAssignment
        'cm-violet':      '#3B1F63',
        'cm-violet-deep': '#2A1B54',
        'cm-gold':        '#F5A800',
        'cm-gold-bright': '#FFC93C',
        'cm-coin':        '#FFCB70',
        'cm-wood':        '#903900',
        'cm-sky':         '#4FBFEF',
        'cm-crimson':     '#C8102E',
        'cm-cream':       '#FFF9EE',
      },
      fontFamily: {
        serif: ['var(--font-playfair, Georgia)', 'serif'],
        sans: ['var(--font-inter, system-ui)', 'sans-serif'],
      },
      keyframes: {
        // moving gradient — used for the champion row in the prioritization table
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 3.2s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
