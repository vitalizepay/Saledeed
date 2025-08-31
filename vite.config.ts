// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => {
  // Load .env files and expose only VITE_* to the client
  const env = loadEnv(mode, process.cwd(), ""); // we don't actually need 'env' below

  return {
    // IMPORTANT: set this to your GitHub repo name for project pages
    // e.g. base: "/copy-of-tamil-sale-deed-drafting-assistant/"
    base: "/Saledeed/",

    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },

    // Do NOT inject secrets as process.env.* – use import.meta.env.VITE_*
    // so you can pass them safely via the workflow (still visible in bundle;
    // restrict by domain in Google AI Studio).
  };
});
