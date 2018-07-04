import './index.pug'
import 'semantic-ui-offline/semantic.min.css'

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

    focus(state, payload) {
      state.editTarget = payload.hash
      state.editTargetProps = payload.props
    },

    unfocus(state) {
      state.editTarget = ''
      state.editTargetProps = {}
    },

    editProps(state, payload) {
      state.editTargetProps[payload.key] = payload.value
    },

  },

  getters: {

    isFocus: state => (name, focus) => name == state.editTarget && focus,

  },

})

const  app = new Vue({
  el: '#app',
  render: h => h(App),
  store: store,
})
