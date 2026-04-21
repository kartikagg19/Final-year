import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  // ✅ REQUIRED for Netlify to avoid white page
  base: "/",

  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },

  server: {
    port: 5173
  }
});
