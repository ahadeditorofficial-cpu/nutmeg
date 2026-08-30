/// <reference lib="webworker" />
// Nutmeg service worker — built by next-pwa with InjectManifest
// Workbox precaches the manifest automatically; we add our own handlers.

import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'

declare const self: ServiceWorkerGlobalScope

const CACHE_VERSION = 'nutmeg-v1'
const CACHE_NAME = `${CACHE_VERSION}`
const OFFLINE_URL = '/offline.html'

// Tell the service worker to immediately take control of all clients.
clientsClaim()

// Precache all files emitted by the Next.js build + public assets.
precacheAndRoute(self.__WB_MANIFEST)

// Runtime caching for the app shell and media.
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 })],
  })
)

registerRoute(
  /\.(?:js|css|ts|tsx|jsx|mjs)$/i,
  new StaleWhileRevalidate({
    cacheName: 'static-js-assets',
    plugins: [new ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 })],
  })
)

registerRoute(
  /\.(?:png|jpg|jpeg|gif|svg|webp|ico)$/i,
  new CacheFirst({
    cacheName: 'static-image-assets',
    plugins: [new ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 7 * 24 * 60 * 60 })],
  })
)

registerRoute(
  /\.(?:mp3|wav|ogg|mp4)$/i,
  new CacheFirst({
    cacheName: 'media-assets',
    plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 7 * 24 * 60 * 60 })],
  })
)

// Runtime API caching with NetworkFirst + fallback.
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 5 * 60 }),
      {
        handlerDidError: async () =>
          new Response(JSON.stringify({ error: 'offline' }), {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          }),
      },
    ],
    networkTimeoutSeconds: 5,
  })
)

// The catch-all handler serves the offline fallback page for document requests
// that are not precached and fail to fetch from the network.
const handler = createHandlerBoundToURL(OFFLINE_URL)
registerRoute(({ request }) => request.destination === 'document', handler, 'GET')

// Clean up old caches on activate.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n !== CACHE_NAME)
          .map((n) => caches.delete(n))
      )
    )
  )
})

// Log install/activate for debugging in production.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())
