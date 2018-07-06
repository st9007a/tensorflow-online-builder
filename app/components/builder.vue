<template lang="pug">
.v-builder
  sui-menu.menu(vertical, secondary)
    sui-menu-item(v-for='(cls, idx) in list', :key='cls.name')
      sui-menu-header(@click='toggle(idx)') {{cls.name}}
      sui-menu-menu(v-if='idx == currentListIdx')
        a(is='sui-menu-item', v-for='item in cls.list', :key='item.name', @click='createTensor(item.name)') {{item.name}}
  svg.edit-interface
    v-tensor(
      v-for='(t, id) in tensors'
      v-model='t.rect'
      :key='id'
      :hash='id'
      :color='t.color'
      :propstemplate='t.props'
      :height='t.rect.height'
      :width='t.rect.width'
      :inCount='t.inCount'
      :outCount='t.outCount'
    )
  sui-segment: sui-form
    sui-form-field(v-for='(p, k) in editTargetProps')
      template(v-if='p.type == "dtype"')
        label {{k}}
        sui-dropdown(selection, placeholder='Data Type', :options='dtype')
      template(v-else)
        label {{k}}
        input(type='text', :value='p.value', @input='propChange(k, $event)')
</template>

<script>
import { mapState } from 'vuex'
import { cloneDeep } from 'lodash'
import SHA256 from 'crypto-js/sha256'
import tensorConfig from '../res/tensor.config.json'
import dtype from '../res/dtype.json'
import Tensor from './tensor.vue'
export default {
  name: 'Builder',

  components: {
    'v-tensor': Tensor,
  },

  data() {
    return {
      dtype: [],
      currentListIdx: -1,
      list: [
        {
          name: 'Basic Op',
          list: [
            { name: 'Constant' },
            { name: 'Placeholder' },
          ],
        },
        {
          name: 'Math Op',
          list: [
            { name: 'Matmul' },
          ],
        },
      ],
      tensors: {},
    }
  },

  computed: {

    ...mapState(['editTargetProps'])

  },

  created() {
    this.$data.dtype = dtype
  },

  methods: {

    createTensor(name) {
      const template = cloneDeep(tensorConfig[name])
      let id = SHA256(template.props.name.value + (new Date()).toJSON()).toString()
      template.props.name.value += '_' + id.substring(0, 4)

      this.$set(this.$data.tensors, id, template)
    },

    propChange(key, e) {
      this.$store.commit('editProps', { key: key, value: e.target.value })
    },

    toggle(idx) {
      if (idx == this.$data.currentListIdx) {
        this.$data.currentListIdx = -1
      } else {
        this.$data.currentListIdx = idx
      }
    },

  },
}
</script>

<style lang="sass" scoped>
.v-builder
  height: 100%
  display: flex

  *
    user-select: none

  .ui.menu
    flex: 0 0 150px

  .edit-interface
    flex: 1 1 auto

  .ui.segment
    flex: 0 0 300px
    margin: 0 0 0 1.5rem

svg
  border: 4px solid rgba(0, 0, 0, .8)
  border-radius: 15px

.fade-enter-active
  transition: opacity .2s

.fade-leave-active
  transition: opacity .3s

.fade-enter, .fade-leave-to
  opacity: 0

</style>
