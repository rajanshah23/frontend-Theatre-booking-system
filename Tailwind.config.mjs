// tailwind.config.mjs
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f59e0b",
        secondary: "#d97706",
      },
    },
  },
  plugins: [],
  // Remove safelist if not needed
}