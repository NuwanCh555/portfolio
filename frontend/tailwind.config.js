/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark:      'var(--color-bgDark)',
        surface:     'var(--color-surface)',
        borderLight: 'var(--color-borderLight)',
        primary:     'var(--color-primary)',
        primaryGlow: 'var(--color-primaryGlow)',
        secondary:   'var(--color-secondary)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
}
