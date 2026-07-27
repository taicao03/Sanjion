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
        noir: {
          canvas: '#0B0D11',
          surface: '#161B22',
          border: '#232A35',
          paper: '#EDEFF2',
          muted: '#8B94A3',
        },
        compile: {
          gold: '#C9962C',
        },
        pass: {
          green: '#2FAE79',
        },
        senior: {
          indigo: '#5B54D9',
        },
        fail: {
          rust: '#C1553B',
        },
        sanjion: {
          pink: '#ec4899',
          'pink-dark': '#db2777',
          purple: '#5B54D9',
          'purple-dark': '#4b45b0',
          gold: '#C9962C',
          'gold-dark': '#a3771e',
          light: '#161B22',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
