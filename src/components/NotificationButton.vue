<template>
  <button v-if="player.id" v-on:click="toggleSubscribe">
    {{verb}} push notifications
  </button>
</template>

<script>

// todo: run this on mount or something
// if (navigator.serviceWorker.controller) {
//   navigator.serviceWorker.controller.postMessage({
//     command: 'setGameId',
//     message: {
//       gameId
//     }
//   })
// }

  import {mapActions, mapGetters} from 'vuex'

  export default {
    data() {
      return {
        enabled: true,
      }
    },
    computed: {
      ...mapGetters({
        player: 'player',
        board: 'board',
        game: 'game',
      }),
      verb () {
        return this.enabled ? 'Disable' : 'Enable'
      }
    },
    created() {
      if ('serviceWorker' in navigator) {
        // todo: remove dist from this path
        const appPath = process.env.NODE_ENV === 'production' ? '/vue-chess' : ''
        navigator.serviceWorker.register(`${appPath}/sw.js`)
          .then(this.initialiseState)
          .catch((err) => console.error(':^(', err))
      }
    },
    methods: {
      ...mapActions(['subscribe', 'unsubscribe']),
      toggleSubscribe(evt) {
        if (this.enabled) {
          this.dounsubscribe()
        } else {
          this.dosubscribe()
        }
      },
      initialiseState(swRegistration) {
        if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
          console.warn('No notification support')
          return
        }

        if (Notification.permission === 'denied') {
          console.warn('User has denied notifcation permission')
          return
        }

        if (!('PushManager' in window)) {
          console.warn('No PushManager in window')
          return
        }

        this.swRegistration = swRegistration

        swRegistration.pushManager.getSubscription()
        .then((subscription) => {
          if (!subscription) {
            this.enabled = false
            return
          }
          this.subscribe(subscription)
          this.enabled = true
        })
      },
      dosubscribe() {
        this.swRegistration.pushManager.subscribe({userVisibleOnly: true})
        .then((subscription) => {
          this.enabled = true
          this.subscribe(subscription)
        })
        .catch((err) => {
          console.warn('getSubscription() failed', err)
        })
      },
      dounsubscribe() {
        navigator.serviceWorker.ready.then((swRegistration) => {
          swRegistration.pushManager.getSubscription().then((subscription) => {
            if (!subscription) {
              this.enabled = false
              return
            }
            this.unsubscribe(subscription)
            subscription.unsubscribe().then((successful) => {
              this.enabled = false
            })
          })
        })
      },
    },
  }
</script>
