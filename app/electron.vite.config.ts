import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: { build: { rollupOptions: { input: resolve('main/index.ts') } }, plugins: [externalizeDepsPlugin()] },
  preload: { build: { rollupOptions: { input: resolve('preload/index.ts') } }, plugins: [externalizeDepsPlugin()] },
  renderer: { root: resolve('src/renderer'), resolve: { alias: { '@renderer': resolve('src/renderer') } }, plugins: [react()] }
});
