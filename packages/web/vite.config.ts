import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        // Cache the shell + all static assets
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        // Network-first for API/WS calls so the UI always gets fresh data
        runtimeCaching: [
          {
            urlPattern: /^\/api\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^\/ws\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
        // Skip waiting so new service worker activates immediately on refresh
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: 'OpenMacaw',
        short_name: 'OpenMacaw',
        description: 'Self-hosted MCP Agent Platform with granular permission control',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/chat',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'OpenMacaw Chat',
          },
        ],
      },
      // Also generate a separate manifest file that index.html can link to
      manifestFilename: 'manifest.webmanifest',
      // Enable the service worker in dev mode so you can test PWA install
      // and notifications without running a production build.
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  root: '.',
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
});
