/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#96a1ad',
        accent: {
          green: '#22c55e',
          amber: '#fbbf24',
          orange: '#f97316',
          red: '#ef4444',
        }
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}