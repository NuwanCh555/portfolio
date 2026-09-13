/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark:      '#030305',
        surface:     '#0a0a0f',
        borderLight: 'rgba(0, 255, 65, 0.15)',
        primary:     '#00ff41',
        primaryGlow: 'rgba(0, 255, 65, 0.4)',
        secondary:   '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
