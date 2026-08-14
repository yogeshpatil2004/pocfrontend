/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff3ec',
          100: '#ffe5d3',
          200: '#fccab6',
          300: '#fca683',
          400: '#fc7b45',
          500: '#fc4e05',
          600: '#d34103',
          700: '#a93504',
          800: '#872b05',
          900: '#6c2406',
          950: '#3b1000',
        },
        sidebar: '#000000',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        headline: ['Newsreader', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}