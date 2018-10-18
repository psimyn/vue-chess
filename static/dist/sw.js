importScripts("/static/precache-manifest.66761382e4c7f1ee529c45b55aeb6af8.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.2/workbox-sw.js");

// eslint-env serviceWorker
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '204431620450'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
try {
  const messaging = firebase.messaging()
} catch (e) {
  console.warn('No messaging', e)
}

