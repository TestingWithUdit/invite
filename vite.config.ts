import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Short shareable GitHub Pages URL:
// https://TestingWithUdit.github.io/invite/
export default defineConfig({
  base: '/invite/',
  plugins: [react(), tailwindcss()],
});
