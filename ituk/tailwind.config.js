/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{html,css,js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#870042',
        'secondary': '#ad0054',
        'white': '#eeeeee',
        'gray': '#4c4c4e',
        'dark': '#131313',
        'black': '#000000',
        'facebook': '#1868fc',
        'instagram': '#ff0069',
        'github': '#2dba4e'
      },
      boxShadow: {
        'filled': '3px 3px 10px 0px black',
        'nofill': 'inset 3px 3px 10px 0px black, 3px 3px 10px 0px black'
      },
    },
  },
  plugins: [],
}