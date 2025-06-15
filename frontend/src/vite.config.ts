import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: process.env.VITE_API_BASE ?? "http://93.81.237.94:1111",
        changeOrigin: true,
      },
    },
  },
});

