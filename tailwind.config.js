/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bgDark: '#071028',
        accentOrange: '#FF6A00',
        cardGrey: '#0F1724',
        textLight: '#E6EEF6',
        textMuted: '#9FB0C8'
      }
    }
  },
  plugins: [],
}
