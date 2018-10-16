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
import querystring from 'querystring'
import App from './App.vue'
import storeConfig from './store/store'
import { auth, database } from './store/firebase'

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

function generateGameId() {
  return (Math.random() * new Date().getTime()).toString(36).slice(0, 6)
}

if (process.env.NODE_ENV !== 'test') {
  const gameId = document.location.hash.slice(1) || generateGameId()
  store.dispatch('loadGame', gameId)

  const query = window.location.search.slice(1)
  let { moves = '' } = querystring.parse(query)
  store.dispatch('addMoves', moves.split(','))

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
