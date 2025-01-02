import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      // Only set proxy for development mode
      proxy: mode === "development" 
        ? {
            "/api": {
              target: process.env.VITE_BACKEND_URL_DEV, // Proxy to backend in dev
              changeOrigin: true, // Change origin to match the target
              rewrite: (path) => path.replace(/^\/api/, ""), // Optionally remove /api prefix
            },
          }
        : {},
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // In production, make sure API calls directly hit the production API URL
      define: {
        "process.env": {
          VITE_BACKEND_URL: process.env.VITE_BACKEND_URL_PROD, // Direct API URL for production
        },
      },
    },
  };
});
