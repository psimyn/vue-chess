import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import {store, firebase} from './vuex/store'
import {sync} from 'vuex-router-sync'

Vue.use(VueRouter)

const Game = new Vue({
  render: h => h(App),
})

const NewGame = { template: '<p>Starting new game</p>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/vue-chess/new', name: 'new', component: NewGame },
    { path: '/vue-chess/:gameId', name: 'game', component: Game },
  ]
})

sync(store, router)

new Vue({
  router,
  store,
  firebase,
  render: h => h(App),
}).$mount('#app')
//
// router.map({
//   '/:gameId': {
//     component: Game
//   }
// })
//
// router.start(AppWrapper, '#app')
