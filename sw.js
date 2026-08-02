// Service worker AgriWinners — mise en cache pour usage hors connexion.
// Incrémente CACHE_NAME à chaque mise à jour de contenu pour forcer le rafraîchissement.
const CACHE_NAME = "agriwinners-v7";
const ASSETS = [
  "./index.html",
  "./manifest.json",
  "./dosages.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/logo-header.png",
  "./authenticite/4soil.jpg",
  "./authenticite/4tree.jpg",
  "./authenticite/booster.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Les appels à l'API de licence (POST) ne doivent jamais passer par le cache :
  // toujours réseau direct, jamais de mise en cache d'une requête non-GET.
  if (event.request.method !== "GET") {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // met en cache les nouvelles requêtes réussies (même origine seulement)
          if (response.ok && event.request.url.startsWith(self.location.origin)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached); // hors connexion et pas en cache : échec silencieux géré par l'app
    })
  );
});
