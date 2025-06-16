// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: 5173,
    },
    build: {
      outDir: "dist",
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    base: env.VITE_BASE_PATH || "/",
  
    css: {
      postcss: {
        plugins: [
          require('@tailwindcss/postcss'),
          require('autoprefixer'),
        ],
      },
    },
  };
});