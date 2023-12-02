/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    colors: {
      'white' : '#ffffff',
      'black' : '#000000',
      'dark-blue': '#02162d',
      'logo-blue':'#232252',
      'blue':'#054b9b',
      'light-blue':'#469ad6',
      'pale-blue':'#cbd6e4',
      'gray-blue': '#273444',
      'gray': '#8895a6',
      'gray-light': '#e5e7eb',
      'red': '#7f1d1d'
    },
    extend: {
      margin: {
      '120': '120px', // You can adjust the value as needed
    }},
  },
  plugins: [],
}