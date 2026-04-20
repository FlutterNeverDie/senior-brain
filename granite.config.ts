import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "senior-brain",
  brand: {
    displayName: "부모님 치매예방",
    primaryColor: "#FF6B9D",
    icon: "",
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite dev",
      build: "vite build",
    },
  },
  permissions: [],
  outdir: "dist",
});
