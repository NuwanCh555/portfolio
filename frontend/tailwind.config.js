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
      keyframes: {
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)'  },
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan':       'scan 3s linear infinite',
      },
    },
  },
  plugins: [],
}
