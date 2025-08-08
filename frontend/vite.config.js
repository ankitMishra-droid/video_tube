import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    server: {
      proxy: {
        "/api": "https://video-tube-indol.vercel.app/api",
      },
      host: "0.0.0.0"
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
