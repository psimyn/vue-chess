console.log('service worker loaded ')

self.addEventListener('install', function(event) {
  self.skipWaiting()
})

self.addEventListener('push', function(event) {
  console.log('Push message', event)

  const title = `It's your move!`
  const body = 'Click to go to game'
  const icon = 'https://psimyn.com/vue-chess/dist/white-pawn.png'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
    })
  )
})

self.addEventListener('notificationclick', function(event) {
  // android doesn't close notification - http://crbug.com/463146
  event.notification.close()

  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then((clientList) => {
      // todo: check gameId
      const existingWindow = clientList.find(client => client.url === '/' && 'focus' in client)
      if (existingWindow) {
        existingWindow.focus()
      } else {
        clients.openWindow('/')
      }
    })
  )
})
