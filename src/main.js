import Vue from 'vue'
import App from './App.vue'
import {store} from './vuex/store'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
.catch((err) => console.error(':^(', err))
}

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
