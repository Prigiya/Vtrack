// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    // port: 4000,
    strictPort: false,
  },
  server: {
    // port: 8000,
    strictPort: false,
    host: true,
    origin: "http://192.168.61.10:8080/api",
  },
});

