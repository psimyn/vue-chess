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
    "url": "black-bishop.svg",
    "revision": "1f3b8d1a5879539b447e445f640b2c47"
  },
  {
    "url": "black-king.svg",
    "revision": "66e1bcad247d72c9e9737b71ce9e87cf"
  },
  {
    "url": "black-knight.svg",
    "revision": "d39f1d02cda5131fc4c815f276a0521d"
  },
  {
    "url": "black-pawn.svg",
    "revision": "1c52d8c48822d6d34d8930244159e6f3"
  },
  {
    "url": "black-queen.svg",
    "revision": "7b3e33e471081b583cef68ff12e4a0b7"
  },
  {
    "url": "black-rook.svg",
    "revision": "96872a66f1b7e639aa91bd133e17bb35"
  },
  {
    "url": "build.js",
    "revision": "08a95500026e84ab2f3a20cb64f3ca90"
  },
  {
    "url": "google.svg",
    "revision": "d5cc60037da1933018fd4046319a8228"
  },
  {
    "url": "white-bishop.svg",
    "revision": "09004fd25a45b4c67f0bbc41a09062af"
  },
  {
    "url": "white-king.svg",
    "revision": "250510fffdafda4ad4ab5f5504f2af55"
  },
  {
    "url": "white-knight.svg",
    "revision": "e6294efee2d0786df7925c7a6cad4510"
  },
  {
    "url": "white-pawn.svg",
    "revision": "d69014fbb3f6e3da7b29d058477c1e9a"
  },
  {
    "url": "white-queen.svg",
    "revision": "4320a2dd26e5bc4ee9f550f3aecd737c"
  },
  {
    "url": "white-rook.svg",
    "revision": "095b1a06667a527afbd834e74f00edc9"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
