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
          900: '#003B20',
          800: '#004D2A',
          700: '#006B38',
          600: '#15803D',
          500: '#16A34A',
          400: '#22C55E',
          300: '#4ADE80',
          200: '#86EFAC',
          100: '#DCFCE7',
          50: '#F1F8F3',
        },
      },
    },
  },
  plugins: [],
}
