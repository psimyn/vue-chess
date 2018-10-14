import {
  Button,
  Card,
  Loading,
  Row,
  Switch,
  Tabs,
  TabPane
} from 'element-ui'

export default function (Vue) {
  Vue.use(Button)
  Vue.use(Card)
  Vue.use(Row)
  Vue.use(Switch)
  Vue.use(Tabs)
  Vue.use(TabPane)

  // Vue.use(Loading.directive)

  // Vue.prototype.$loading = Loading.service
}