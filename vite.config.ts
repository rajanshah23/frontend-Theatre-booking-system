import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: 5173,
    },
    build: {
      outDir: "dist",
    },
    base: env.VITE_BASE_PATH || "/",
    css: {
      postcss: {
        plugins: [
          tailwindcss,   
          autoprefixer,
        ],
      },
    },
  };
});