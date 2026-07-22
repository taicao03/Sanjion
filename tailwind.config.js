/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sanjion: {
          pink: '#ec4899',
          'pink-dark': '#db2777',
          purple: '#8b5cf6',
          'purple-dark': '#7c3aed',
          gold: '#eab308',
          'gold-dark': '#d97706',
          light: '#fff5f7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
