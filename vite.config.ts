import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/cursed-waters/",
  assetsInclude: ["**/*.glb", "**/*.gltf"],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
