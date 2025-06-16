// tailwind.config.mjs
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add these to capture all possible class usage
    "./node_modules/flowbite/**/*.js",
    "./node_modules/react-toastify/dist/ReactToastify.css"
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
  // Prevent purging of all classes (temporary)
  safelist: [
    {
      pattern: /./, // Safelist all classes
    },
  ],
}