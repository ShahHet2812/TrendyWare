import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is the proxy that will fix the CORS error.
    proxy: {
      // ONLY requests starting with /api will be forwarded to the backend.
      // Client-side routes like /login, /shop, etc., will be handled by React Router.
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});