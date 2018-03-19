import Vue from 'vue'
import {
  Button,
  Card,
  Row,
  Switch,
  Tabs,
  TabPane
} from 'element-ui'
import App from './App.vue'
import {store} from './vuex/store'

Vue.use(Button)
Vue.use(Card)
Vue.use(Row)
Vue.use(Switch)
Vue.use(Tabs)
Vue.use(TabPane)

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
