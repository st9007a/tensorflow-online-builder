import './index.pug'

import 'semantic-ui-offline/semantic.min.css'

import Vue from 'vue'

import App from './app.vue'

const  app = new Vue({
  el: '#app',
  render: h => h(App),
})
