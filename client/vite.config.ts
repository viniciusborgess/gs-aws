import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// O build do React vai direto para ../public, que e a mesma pasta que o
// Express ja serve via express.static. Em producao (Azure) o servidor entrega
// esses arquivos estaticos; nao ha um segundo processo de front.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "../public"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    // No dev rodamos o Vite (:5173) e o Express (:3000) lado a lado.
    // O proxy faz as chamadas /api baterem no Express real.
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
