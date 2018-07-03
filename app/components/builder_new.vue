<template lang="pug">
.v-builder
  .ui.left.secondary.vertical.menu
    .item(v-for='(cls, idx) in list', @click='toggle(idx)')
      .header {{cls.name}}
      transition(name='fade')
        .menu(v-if='idx == currentListIdx')
          a.item(v-for='item in cls.list', @dblclick='createTensor(item.name)') {{item.name}}
  svg.edit-interface
    v-tensor(
      v-for='(t, id) in tensors'
      v-model='t.rect'
      :key='id'
      :color='t.color'
      :propstemplate='t.props'
      :height='t.rect.height'
      :width='t.rect.width'
    )
  .ui.segment
</template>

<script>
import { cloneDeep } from 'lodash'
import SHA256 from 'crypto-js/sha256'
import tensorConfig from '../res/tensor.new.config.json'
import Tensor from './tensor_new.vue'
export default {
  name: 'Builder',

  components: {
    'v-tensor': Tensor,
  },

  data() {
    return {
      tensors: {},
      currentListIdx: -1,
      list: [
        {
          name: 'Basic Op',
          list: [
            { name: 'Constant' },
          ],
        },
      ]
    }
  },

  methods: {

    createTensor(name) {
      const template = cloneDeep(tensorConfig[name])
      let id = SHA256(template.props.name + (new Date()).toJSON()).toString()
      template.props.name += '_' + id.substring(0, 4)

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
