/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "dist/black-bishop.svg",
    "revision": "1f3b8d1a5879539b447e445f640b2c47"
  },
  {
    "url": "dist/black-king.svg",
    "revision": "66e1bcad247d72c9e9737b71ce9e87cf"
  },
  {
    "url": "dist/black-knight.svg",
    "revision": "d39f1d02cda5131fc4c815f276a0521d"
  },
  {
    "url": "dist/black-pawn.svg",
    "revision": "1c52d8c48822d6d34d8930244159e6f3"
  },
  {
    "url": "dist/black-queen.svg",
    "revision": "7b3e33e471081b583cef68ff12e4a0b7"
  },
  {
    "url": "dist/black-rook.svg",
    "revision": "96872a66f1b7e639aa91bd133e17bb35"
  },
  {
    "url": "dist/build.js",
    "revision": "1c34779b680b83823f62a9ef8d171aae"
  },
  {
    "url": "dist/google.svg",
    "revision": "d5cc60037da1933018fd4046319a8228"
  },
  {
    "url": "dist/localforage.min.js",
    "revision": "9d032ec6c6b5a0321a0485030109cb87"
  },
  {
    "url": "dist/white-bishop.svg",
    "revision": "09004fd25a45b4c67f0bbc41a09062af"
  },
  {
    "url": "dist/white-king.svg",
    "revision": "250510fffdafda4ad4ab5f5504f2af55"
  },
  {
    "url": "dist/white-knight.svg",
    "revision": "e6294efee2d0786df7925c7a6cad4510"
  },
  {
    "url": "dist/white-pawn.svg",
    "revision": "d69014fbb3f6e3da7b29d058477c1e9a"
  },
  {
    "url": "dist/white-queen.svg",
    "revision": "4320a2dd26e5bc4ee9f550f3aecd737c"
  },
  {
    "url": "dist/white-rook.svg",
    "revision": "095b1a06667a527afbd834e74f00edc9"
  },
  {
    "url": "favicon.png",
    "revision": "04668195fd68dfefd22f38795d567e9b"
  },
  {
    "url": "firebase-messaging-sw.js",
    "revision": "190bdaf8aa2b80931976f8a4f7ce63c0"
  },
  {
    "url": "index.html",
    "revision": "a9a7fbbbbd82f2f91b88153927da3aa3"
  },
  {
    "url": "workbox-sw.prod.v1.0.1.js",
    "revision": "3fbc93cd82283d7c3a2cb4dcaf36be91"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
