import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "senior-brain",
  brand: {
    displayName: "부모님 치매예방",
    primaryColor: "#FF6B9D",
    icon: "https://static.toss.im/appsintoss/16823/d0e0d433-614e-4f36-97d3-a7127ce120fb.png",
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
