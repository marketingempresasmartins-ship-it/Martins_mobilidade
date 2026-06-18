import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 8080,
    hmr: {
      overlay: false
    }
  },
  preview: {
    host: "127.0.0.1",
    port: 8080
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"]
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, "/");
          if (!normalizedId.includes("/node_modules/")) return undefined;

          if (normalizedId.includes("/node_modules/react/") || normalizedId.includes("/node_modules/react-dom/") || normalizedId.includes("/node_modules/react-router-dom/")) {
            return "vendor-react";
          }

          if (normalizedId.includes("/node_modules/lucide-react/") || normalizedId.includes("/node_modules/clsx/") || normalizedId.includes("/node_modules/tailwind-merge/") || normalizedId.includes("/node_modules/class-variance-authority/")) {
            return "vendor-ui";
          }

          return "vendor";
        }
      }
    }
  }
});
