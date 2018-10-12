import Vue from 'vue'
import Vuex from 'vuex'
import {
  Button,
  Card,
  Loading,
  Row,
  Switch,
  Tabs,
  TabPane
} from 'element-ui'
import App from './App.vue'
import storeConfig from './vuex/store'
import { auth, database } from './vuex/firebase'

Vue.use(Button)
Vue.use(Card)
Vue.use(Row)
Vue.use(Switch)
Vue.use(Tabs)
Vue.use(TabPane)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service

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

// todo: move this to created in App.vue or something
if (process.env.NODE_ENV !== 'test') {
  const gameId = document.location.hash.slice(1) || database.ref('games').push().key
  store.dispatch('loadGame', gameId)
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
