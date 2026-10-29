import flowbitePlugin from "flowbite/plugin";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          light: "#ffeaea",
          soft: "#fdd5d3",
          DEFAULT: "#faa4a2",
        },
        cocoa: {
          light: "#7a5a4b",
          DEFAULT: "#4a2c20",
        },
      },
      fontFamily: {
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
        heading: ["Fraunces", "Georgia", "serif"],
      },
    },
  },
  plugins: [flowbitePlugin],
}
