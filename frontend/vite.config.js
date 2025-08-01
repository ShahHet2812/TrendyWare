import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is the proxy that will fix the CORS error.
    proxy: {
      // Any request from the frontend that starts with '/api' OR '/login' OR '/signup'
      // will be forwarded to your Node.js server running on port 5000.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/login": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/signup": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});