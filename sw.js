console.log('service worker loaded ')

self.addEventListener('install', function(event) {
  self.skipWaiting()
})

self.addEventListener('push', function(event) {
  console.log('Push message', event)

  const title = `It's your move!`
  const body = 'Click to go to game'
  // const icon = 'https://psimyn.com/vue-chess/dist/black-pawn.svg'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
    })
  )
})
