import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#870042',
        'secondary': '#ad0054',
        'light': '#eeeeee',
        'gray': '#4c4c4e',
        'dark': '#131313',
        'facebook': '#1868fc',
        'instagram': '#ff0069',
        'github': '#2dba4e',
        'extra': '#87004280',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1146px',
        xl: '1344px',
        '2xl': '1536px',
      },
      backgroundImage: {
        'epic-gradient': 'linear-gradient(90deg, rgba(75, 0, 110, 0.528) 0.07%, rgba(135, 0, 66, 0.528) 99.94%)',
        'about-bg': "url('@/assets/images/about.jpg')",
        'cooperation-bg': "url('@/assets/images/cooperation.jpg')",
        'rent-bg': "url('@/assets/images/rent.jpg')",
        'derp-bg': "url('@/assets/images/derp.jpg')",
        'join-bg': "url('@/assets/images/liitu.jpg')",
      },
      boxShadow: {
        'filled': '3px 3px 10px 0px black',
        'nofill': 'inset 3px 3px 10px 0px black, 3px 3px 10px 0px black',
      },
      animation: {
        rotate: '2s cubic-bezier(.68,-0.55,.27,1.55) infinite rotate',
        etator: '2s cubic-bezier(.68,-0.55,.27,1.55) infinite etator',
        bright: 'bright 1s infinite',
      },
      keyframes: {
        rotate: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        etator: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(-360deg)',
          },
        },
        bright: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
