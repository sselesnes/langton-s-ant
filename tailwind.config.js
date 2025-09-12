/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "320px", // custom breakpoint for 320px
        sm: "375px", // custom breakpoint for 375px
      },
    },
  },
  plugins: [],
};
