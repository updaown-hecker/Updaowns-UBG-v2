import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";
import { dirname, join } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Serve HTML files in /games/ as static, bypassing Vite transforms
    {
      name: 'serve-games-html-as-static',
      enforce: 'pre' as const,
      configureServer(server: import('vite').ViteDevServer) {
        server.middlewares.use((req: import('http').IncomingMessage, res: import('http').ServerResponse, next: () => void) => {
          if (req.url && req.url.startsWith('/games/') && req.url.endsWith('.html')) {
            const filePath = join(dirname(__filename), req.url);
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'text/html');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
