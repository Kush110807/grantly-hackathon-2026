import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// /preview.html is development-only. Production builds ONLY index.html.
export default defineConfig({
  plugins: [react()],
  build: { rollupOptions: { input: 'index.html' } },
  server: { host: '0.0.0.0' }
});
