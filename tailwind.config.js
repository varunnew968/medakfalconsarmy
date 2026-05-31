/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'falcon-red': '#FF7A00', /* Redefined to orange as requested */
        'primary-orange': '#FF7A00',
        'midnight-black': '#0A0E13', /* Dark Background */
        'eagle-gold': '#D4AF37',
        'dark-bg': '#0A0E13',
        'card-bg': '#111827',
      },
      fontFamily: {
        'heading': ['Cinzel', 'serif'],
        'body': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
