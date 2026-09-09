// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:8000',
        '/storage': 'http://127.0.0.1:8000',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['chess-nag-trend.ngrok-free.dev'],
    port: 4321,
  },
  devToolbar: {
    enabled: false
  }
});