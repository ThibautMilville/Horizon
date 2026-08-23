import path from "node:path";
import react from "@vitejs/plugin-react";
import {defineConfig} from "vitest/config";

export default defineConfig({
  plugins: [react()],

  root: path.resolve(__dirname, "./src"),

  publicDir: path.resolve(__dirname, "./src/public"),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: path.resolve(__dirname, "./dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        app: path.resolve(__dirname, "./src/index.html"),
      },
    },
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 850,
  },

  server: {
    host: true,
    port: 8080,
    strictPort: true,
    hmr: {
      port: 8081,
      clientPort: 8081,
    },
  },

  preview: {
    host: true,
    port: 8080,
    strictPort: true,
  },

  test: {
    coverage: {
      all: true,
      provider: "v8",
      include: ["**/*.{ts,tsx}"],
      exclude: [
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/shared/graphql.ts",
        "**/test/**",
        "**/*.{config,*rc}.*",
      ],
      reporter: ["text", "cobertura"],
      reportsDirectory: path.resolve(__dirname, "../../coverage"),
      thresholds: {
        statements: 40,
        branches: 70,
        functions: 60,
        lines: 40,
      },
    },
    environment: "jsdom",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    setupFiles: [path.resolve(__dirname, "./src/test/setup.ts")],
  },
});
