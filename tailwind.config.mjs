import plugin from 'tailwindcss/plugin'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        void:     '#0A0A0A',
        paper:    '#F4F4F4',
        metal:    '#858585',
        signal:   '#FF3B30',
        verified: '#22C55E',
        warning:  '#F59E0B',
        info:     '#1A56DB',
        surface: {
          0: '#0A0A0A',
          1: '#111111',
          2: '#1A1A1A',
          3: '#242424',
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "'Helvetica Neue'", "Arial", "sans-serif"],
        mono:    ["'Roboto Mono'", "'Courier New'", "monospace"],
      },
      borderRadius: {
        DEFAULT: '2px',
        none:    '0px',
        sm:      '2px',
      },
      boxShadow: {
        none:  'none',
        focus: '0 0 0 2px #FF3B30',  // focus ring only
      },
    },
  },
  plugins: [
    typography,
    plugin(function({ addBase }) {
      addBase({
        'html': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#2A2A2A #0A0A0A',
        },
      })
    }),
  ],
}
