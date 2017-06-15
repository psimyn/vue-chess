importScripts('workbox-sw.prod.v1.0.1.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "/dist/black-bishop.svg",
    "revision": "1f3b8d1a5879539b447e445f640b2c47"
  },
  {
    "url": "/dist/black-king.svg",
    "revision": "66e1bcad247d72c9e9737b71ce9e87cf"
  },
  {
    "url": "/dist/black-knight.svg",
    "revision": "d39f1d02cda5131fc4c815f276a0521d"
  },
  {
    "url": "/dist/black-pawn.svg",
    "revision": "1c52d8c48822d6d34d8930244159e6f3"
  },
  {
    "url": "/dist/black-queen.svg",
    "revision": "7b3e33e471081b583cef68ff12e4a0b7"
  },
  {
    "url": "/dist/black-rook.svg",
    "revision": "96872a66f1b7e639aa91bd133e17bb35"
  },
  {
    "url": "/dist/build.js",
    "revision": "80b31333b96fbeb96e08338277d77e0e"
  },
  {
    "url": "/dist/google.svg",
    "revision": "d5cc60037da1933018fd4046319a8228"
  },
  {
    "url": "/dist/localforage.min.js",
    "revision": "9d032ec6c6b5a0321a0485030109cb87"
  },
  {
    "url": "/dist/white-bishop.svg",
    "revision": "09004fd25a45b4c67f0bbc41a09062af"
  },
  {
    "url": "/dist/white-king.svg",
    "revision": "250510fffdafda4ad4ab5f5504f2af55"
  },
  {
    "url": "/dist/white-knight.svg",
    "revision": "e6294efee2d0786df7925c7a6cad4510"
  },
  {
    "url": "/dist/white-pawn.svg",
    "revision": "d69014fbb3f6e3da7b29d058477c1e9a"
  },
  {
    "url": "/dist/white-queen.svg",
    "revision": "4320a2dd26e5bc4ee9f550f3aecd737c"
  },
  {
    "url": "/dist/white-rook.svg",
    "revision": "095b1a06667a527afbd834e74f00edc9"
  },
  {
    "url": "/favicon.png",
    "revision": "04668195fd68dfefd22f38795d567e9b"
  },
  {
    "url": "/index.html",
    "revision": "a9a7fbbbbd82f2f91b88153927da3aa3"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
