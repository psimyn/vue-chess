// eslint-env serviceWorker
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js')

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
