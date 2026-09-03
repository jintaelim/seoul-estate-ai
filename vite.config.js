import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { seedDesignPlugin } from "@seed-design/vite-plugin";

export default defineConfig({
  plugins: [react(), seedDesignPlugin({ colorMode: "light-only" })],
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:3100" },
  },
});
