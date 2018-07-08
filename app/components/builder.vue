<template lang="pug">
.v-builder
  sui-menu.menu(vertical, secondary)
    sui-menu-item(v-for='(cls, idx) in list', :key='cls.name')
      sui-menu-header(@click='toggle(idx)') {{cls.name}}
      sui-menu-menu(v-if='idx == currentListIdx')
        a(is='sui-menu-item', v-for='item in cls.list', :key='item', @click='createTensor(item)') {{item}}
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
      :tfFunction='t.function'
    )
  sui-segment: sui-form
    sui-header(v-if='tensors[editTarget]') {{tensors[editTarget].function}}
    template(v-for='(p, k) in editTargetProps')
      v-dropdown(v-if='p.type == "dtype"', placeholder='Data Type', :options='dtype', :propName='k')
      v-checkbox(v-else-if='p.type=="boolean"', :propName='k')
      v-input(v-else, :propName='k')
</template>

<script>
import { mapState }  from 'vuex'
import { cloneDeep } from 'lodash'
import SHA256 from 'crypto-js/sha256'

import Tensor   from './tensor.vue'
import Input    from './form/input.vue'
import Dropdown from './form/dropdown.vue'
import CheckBox from './form/checkbox.vue'

import dtype        from '../res/dtype.json'
import tensorConfig from '../res/tensor.config.json'
import tensorList   from '../res/tensor.list.json'

export default {
  name: 'Builder',

  components: {
    'v-input': Input,
    'v-tensor': Tensor,
    'v-dropdown': Dropdown,
    'v-checkbox': CheckBox,
  },

  data() {
    return {
      dtype: [],
      currentListIdx: -1,
      list: [],
      tensors: {},
    }
  },

  computed: {

    ...mapState(['editTarget', 'editTargetProps'])

  },

  created() {
    this.$data.dtype = dtype
    this.$data.list = tensorList
  },

  methods: {

    createTensor(name) {
      const template = cloneDeep(tensorConfig[name])
      let id = SHA256(template.props.name.value + (new Date()).toJSON()).toString()
      template.props.name.value = id.substring(0, 6)

      this.$set(this.$data.tensors, id, template)
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
