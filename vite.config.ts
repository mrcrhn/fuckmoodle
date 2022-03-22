import { join } from "path"
import type { UserConfig } from "vite"

const PACKAGE_ROOT = __dirname

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config: UserConfig = {
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      "/@/": join(PACKAGE_ROOT, "src") + "/",
    },
  },
  build: {
    sourcemap: "inline",
    target: `chrome96`,
    outDir: "dist",
    assetsDir: ".",
    minify: process.env.MODE !== "development",
    lib: {
      entry: "src/client.ts",
      formats: ["iife"],
      name: "fuckmoodle",
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].cjs",
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
}

export default config
