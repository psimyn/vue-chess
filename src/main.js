import Vue from 'vue'
import App from './App.vue'
import {store, firebase} from './vuex/store'

new Vue({
  el: '#app',
  store,
  // firebase,
  render: h => h(App),
})
