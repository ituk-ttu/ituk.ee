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
      },
      boxShadow: {
        'filled': '3px 3px 10px 0px black',
        'nofill': 'inset 3px 3px 10px 0px black, 3px 3px 10px 0px black',
      },
    },
  },
  plugins: [],
} satisfies Config;
