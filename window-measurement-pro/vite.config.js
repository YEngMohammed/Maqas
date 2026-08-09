import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" → built assets work inside Capacitor's Android WebView (file://)
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
  server: { host: true, port: 5173 },
});
