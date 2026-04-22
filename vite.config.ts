import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three'))           return 'vendor-three';
          if (id.includes('node_modules/framer-motion'))  return 'vendor-motion';
          if (id.includes('node_modules/@supabase'))      return 'vendor-supabase';
          if (id.includes('node_modules/react'))          return 'vendor-react';
          if (id.includes('node_modules/zustand'))        return 'vendor-zustand';
        },
      },
    },
  },
})
