/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '430':'430px',
        '550':'550px',
        '700':'700px',
        '851':'851px',
        '1000': '1000px',
        '1100': '1100px',
        '1200': '1200px',
        '1300': '1300px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}