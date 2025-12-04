import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  /**
   * GitHub Pages:
   * - En local: "/"
   * - En producción (Pages): "/<nombre-del-repo>/"
   *
   * Si tu repo se llama "sanmarcos-conecta", GitHub Actions suele exponerlo como
   * env var. Si no existe, cae al valor fijo.
   */
  base: mode === "development"
    ? "/"
    : (process.env.GITHUB_REPOSITORY
        ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
        : "/sanmarcos-conecta/"),
}));
