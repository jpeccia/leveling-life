import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080', // A URL do seu back-end
        changeOrigin: true,
        secure: false,  // Set to false if you're using HTTP and not HTTPS
        rewrite: (path) => path.replace(/^\/auth/, ''), // Isso ajuda a remover a parte '/auth' na URL
      },
      '/user': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/user/, ''),
      },
      '/friends': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/friends/, ''),
      },
      '/quests': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/quests/, ''),
      },
    },
  },
});
