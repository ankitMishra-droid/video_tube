import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {

  return {
    plugins: [react()],
    server: {
      proxy: mode === "development" ? {
        "/api": {
          target: process.env.VITE_BACKEND_URL_DEV,
          changeOrigin: true,
          secure: false,
        },
      } : {},
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
