/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        void: 'rgb(3 2 5 / <alpha-value>)',
        'space-void': 'rgb(3 2 5 / <alpha-value>)',
        deep: 'rgb(8 6 20 / <alpha-value>)',
        'space-deep': 'rgb(8 6 20 / <alpha-value>)',
        panel: 'rgb(12 10 24 / <alpha-value>)',
        'space-panel': 'rgb(12 10 24 / <alpha-value>)',
        'panel-border': 'rgb(139 92 246 / <alpha-value>)',
        'space-panel-border': 'rgb(139 92 246 / <alpha-value>)',
        accent: 'rgb(139 92 246 / <alpha-value>)',
        'accent-cyan': 'rgb(6 182 212 / <alpha-value>)',
        'accent-amber': 'rgb(245 158 11 / <alpha-value>)',
        'accent-rose': 'rgb(244 63 94 / <alpha-value>)',
        text: 'rgb(229 228 240 / <alpha-value>)',
        'space-text': 'rgb(229 228 240 / <alpha-value>)',
        'space-muted': 'rgb(156 163 175 / <alpha-value>)',
        'space-heading': 'rgb(255 255 255 / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--sans)'],
        heading: ['var(--heading)'],
        mono: ['var(--mono)'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
