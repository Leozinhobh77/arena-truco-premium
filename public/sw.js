// Service Worker para SPA routing no GitHub Pages
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { pathname } = new URL(event.request.url);

  // Se a requisição é para um arquivo que não existe (não é JS/CSS/imagem)
  // redirecionar para index.html
  if (event.request.method === 'GET' &&
      !pathname.match(/\.(js|css|svg|png|jpg|gif|woff|woff2)$/i) &&
      !pathname.includes('/assets/')) {

    event.respondWith(
      fetch(event.request).catch(() => {
        return fetch('/arena-truco-premium/index.html');
      })
    );
  }
});
