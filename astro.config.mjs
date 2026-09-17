// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';

const env = loadEnv('development', '.', '');
const externalDevHost = env.NGROK_HOST || env.PUBLIC_DEV_HOST;

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
      hmr: externalDevHost
        ? {
            protocol: 'wss',
            host: externalDevHost,
            clientPort: 443,
          }
        : undefined,
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
    enabled: false,
  },
});