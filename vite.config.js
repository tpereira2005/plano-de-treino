import { defineConfig } from 'vite';

// base './' → todos os recursos em dist/ usam caminhos relativos,
// para o site funcionar em qualquer domínio ou subpasta depois de publicado.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
});
