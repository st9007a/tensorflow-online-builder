import './index.pug'

import 'semantic-ui-offline/semantic.min.css'
import './app.sass'

import Vue from 'vue'

import App from './app.vue'


if (process.env.NODE_ENV === 'production') {
  Vue.config.devtools = false
  Vue.config.debug = false
  Vue.config.silent = true
}

const  app = new Vue({
  el: '#app',
  render: h => h(App),
})
