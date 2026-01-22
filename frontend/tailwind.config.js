/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#09090b', // Zinc 950
          dark: '#18181b',  // Zinc 900
          gray: '#27272a',  // Zinc 800
        },
        neon: {
          blue: '#22d3ee',   // Cyan 400
          purple: '#c084fc', // Purple 400
          pink: '#f472b6',   // Pink 400
          green: '#4ade80',  // Green 400
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
