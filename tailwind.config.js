// filepath: tailwind.config.js
module.exports = {
  content: [
    "./components/**/*.{vue,js,ts,jsx,tsx}",
    "./layouts/**/*.{vue,js,ts,jsx,tsx}",
    "./pages/**/*.{vue,js,ts,jsx,tsx}",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ffbd59",
          50: "#fffbeb",
          100: "#fff3c7",
          200: "#ffe99b",
          300: "#ffdb6e",
          400: "#ffcd41",
          500: "#ffbd59", // メインカラー
          600: "#e59e29",
          700: "#bf7912",
          800: "#9c5d14",
          900: "#7e4914",
          950: "#472704",
        },
      },
    },
  },
  plugins: [],
};
