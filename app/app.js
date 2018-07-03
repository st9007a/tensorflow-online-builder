import './index.pug'
import 'semantic-ui-offline/semantic.min.css'

import { cloneDeep } from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'

import App from './app.vue'

Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    editTarget: '',
    editTargetProps: {},
  },

  mutations: {

    focus(state, name) {
      state.editTarget = name
    },

    unfocus(state) {
      state.editTarget = ''
    },

    editProps(state, props) {
      state.props = cloneDeep(props)
    },

  },

})

const  app = new Vue({
  el: '#app',
  render: h => h(App),
  store: store,
})
