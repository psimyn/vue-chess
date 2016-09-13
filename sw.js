importScripts('dist/localforage.min.js')

self.addEventListener('install', function(event) {
  self.skipWaiting()
})

self.addEventListener('push', function(event) {
  console.log('Push message', event)

  const title = `It's your move!`
  const body = 'Click to go to game'

  event.waitUntil(
    localforage.getItem('gameId').then((gameId) => {
      console.log(gameId)
      const icon = 'https://psimyn.com/vue-chess/dist/white-pawn.png'
       // const rest = `https://chess-cfde8.firebaseio.com/turns/${playerId}.json?auth=${token}`
      self.registration.showNotification(title, {
        body,
        icon,
        // todo: test for null
        tag: gameId,
      })
    })
  )
})

self.addEventListener('notificationclick', function(event) {
  // android doesn't close notification - http://crbug.com/463146
  event.notification.close()

  var promise = new Promise((resolve, reject) => {
    return localforage.getItem('gameId').then((gameId) => {
      return clients.matchAll({
        type: 'window'
      })
      .then((clientList) => {
        // todo: remove hardcoded path
        const target = `https://psimyn.com/vue-chess/#${gameId}`
        const existingWindow = clientList.find(client => client.url === target && 'focus' in client)
        if (existingWindow) {
          existingWindow.focus()
        } else {
          clients.openWindow(target)
        }
      })
    })
  })

  event.waitUntil(promise)

})

self.addEventListener('message', function(event) {
  var data = event.data
  if (data.command === 'setPlayerToken') {
    localforage.setItem('playerId', data.message.playerId)
    localforage.setItem('token', data.message.token)
  }
  if (data.command === 'setGameId') {
    localforage.setItem('gameId', data.message.gameId)
  }
})
