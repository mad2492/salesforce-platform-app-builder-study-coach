import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/salesforce-platform-app-builder-study-coach/",
  root: "web",
  publicDir: "../public",
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: "../pages-dist",
  },
});
