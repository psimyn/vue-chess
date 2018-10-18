importScripts("/static/precache-manifest.526d5b003969730b1a031277f2c0dc00.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.2/workbox-sw.js");

import Vue from 'vue'
import Vuex from 'vuex'
import querystring from 'querystring'
import registerElements from './elements'
import App from './App.vue'
import storeConfig from './store/store'
import { auth, database } from './store/firebase'

registerElements(Vue)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .catch((err) => console.error(':^(', err))
}

const store = new Vuex.Store(storeConfig)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})

if (process.env.NODE_ENV !== 'test') {
  auth.onAuthStateChanged((user) => {
    if (user) {
      database.ref(`players/${user.uid}`).on('value', (snapshot) => {
        const DEFAULT_NAME = 'Guest'
        const userInfo = snapshot.val() || {}
        user.name = userInfo.name || DEFAULT_NAME
        store.dispatch('setPlayer', user)
      })
    } else {
      database.ref(`players/${store.getters.player.id}`).off('value')
      store.dispatch('setPlayer')
      store.dispatch('signInAnonymously')
    }
  })
}

