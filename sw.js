/* eslint-env serviceworker, browser */
/* global localforage */
importScripts('dist/localforage.min.js')

self.addEventListener('install', function (event) {
  self.skipWaiting()
})

self.addEventListener('push', function (event) {
  const title = `It's your move!`
  const body = 'Click to go to game'
  const icon = 'https://psimyn.com/vue-chess/dist/white-pawn.png'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      // todo: test for null
      tag: 'chess!'
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  // android doesn't close notification - http://crbug.com/463146
  event.notification.close()

  const promise = Promise.all([
    localforage.getItem('playerId'),
    localforage.getItem('token')
  ])
  .then((res) => {
    const playerId = res[0]
    const token = res[1]
    return `https://chess-cfde8.firebaseio.com/players/${playerId}/currentGame.json?auth=${token}`
  })
  .then(url => fetch(url))
  .then(data => data.json())
  .then(gameId => clients.matchAll({
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
  )
  .catch(err => {
    console.error('err' + err)
  })

  event.waitUntil(promise)
})

self.addEventListener('message', function (event) {
  var data = event.data
  if (data.command === 'setPlayerToken') {
    localforage.setItem('playerId', data.message.playerId)
    localforage.setItem('token', data.message.token)
  }
  if (data.command === 'setGameId') {
    localforage.setItem('gameId', data.message.gameId)
  }
})
