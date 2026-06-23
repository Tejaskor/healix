import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  build: {
    // Long-term cacheable hashed file names (Vite default).
    assetsInlineLimit: 4096, // inline tiny assets <4KB as base64 — fewer requests.
    cssCodeSplit: true,       // CSS is split per async chunk.
    sourcemap: false,         // disable in prod for smaller upload + faster build.
    // Vite 8 unbundled esbuild and now ships Oxc as the default minifier —
    // do NOT set `minify: 'esbuild'` (it'll require an extra install). The
    // default is already aggressive minification.
    target: 'es2019',         // modern JS — no legacy polyfill bloat.
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
        // Stable vendor chunks so a code change in app code doesn't bust
        // the browser cache for huge libraries that rarely change.
        // Vite 8 uses Rolldown, which requires manualChunks as a FUNCTION
        // (the object form silently throws `manualChunks is not a function`
        // and fails the build).
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return
          if (id.includes('/react-dom/') || /\/react\/(?!.*router)/.test(id)) return 'react-vendor'
          if (id.includes('react-router')) return 'router'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('axios')) return 'http'
        },
      },
    },
  },
})
