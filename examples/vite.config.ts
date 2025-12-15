import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        bell: resolve(__dirname, 'bell-states.html'),
        gates: resolve(__dirname, 'quantum-gates.html'),
        superposition: resolve(__dirname, 'superposition.html'),
        entanglement: resolve(__dirname, 'entanglement.html'),
        random: resolve(__dirname, 'random-number.html'),
        theme: resolve(__dirname, 'theme-demo.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@quantum': resolve(__dirname, '../library'),
    },
    extensions: ['.ts', '.js', '.json'],
  },
  optimizeDeps: {
    include: ['quantum-circuit', 'mathjs'],
  },
  server: {
    port: 3000,
    open: true,
  },
});
