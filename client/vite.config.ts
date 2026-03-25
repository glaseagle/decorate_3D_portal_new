import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isGithubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  base: isGithubPages ? '/decorate_3D_portal_new/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8765',
      '/ws': {
        target: 'ws://localhost:8765',
        ws: true,
      },
    },
  },
});
