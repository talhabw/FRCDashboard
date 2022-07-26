/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'sneaky': ['Robofan'],
      },
      colors: {
        'sneaky': '#65bc47',
        'sneaky-dark': '#0a9900',
        'sneaky-secondary': '#f5f5f5',
        'sneaky-secondary-dark': '#e5e5e5',
        'sneaky-background': colors.gray[700],
        'sneaky-background-light': colors.gray[600],
      }
    },
  },
  plugins: [],
}
