import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes the build work from any URL path (GitHub Pages serves it under /<repo>/).
export default defineConfig({
  base: './',
  plugins: [react()],
  // Dev server binds to localhost only.
  server: { host: 'localhost', port: 5173, strictPort: true },
});
