


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "localhost",
    port: 5173,
    open: true,
  },
  plugins: [
    react(),
    {
      name: "spa-fallback",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const accept = req.headers.accept || "";
          if (
            accept.includes("text/html") &&
            !req.url.startsWith("/src") &&
            !req.url.includes(".")
          ) {
            req.url = "/index.html";
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
