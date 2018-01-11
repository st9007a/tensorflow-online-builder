<template lang="pug">
.v-builder
  .ui.left.secondary.vertical.menu
    .item(v-for='(items, idx) in list', @click='toggle(idx)')
      .header {{items.name}}
      transition(name='fade')
        .menu(v-if='idx == currentListIdx')
          a.item(:data-type='item.name', v-for='item in items.list', @dblclick='createTensor') {{item.name}}
  svg.edit-interface
    v-tensor(color='#63b5b5', border='#1e8080')
    .elem(v-for='elem in elements', :is='elem.type', color='#63b5b5', border='#1e8080')
</template>

<script>
import Tensor from './tensor.vue'
export default {
  name: 'Builder',

  components: {
    'v-tensor': Tensor,
  },

  data() {
    return {
      currentListIdx: -1,
      elements: [],
      list: [
        {
          name: 'Basic Op',
          list: [
            { name: 'Placeholder' },
            { name: 'Constant' },
            { name: 'Variable' },
          ],
        },
        {
          name: 'Math Op',
          list: [
            { name: 'Log' },
            { name: 'Matmul' },
            { name: 'Add' }
          ],
        },
        {
          name: 'NN Op',
          list: [
            { name: 'Sigmoid' },
            { name: 'Softmax' },
            { name: 'Tanh' },
          ],
        },
      ]
    }
  },

  methods: {
    toggle(idx) {
      if (idx == this.$data.currentListIdx) {
        this.$data.currentListIdx = -1
      } else {
        this.$data.currentListIdx = idx
      }
    },

    createTensor() {
      this.$set(this.$data.elements, this.$data.elements.length, {type: 'v-tensor'})
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
    flex: 0 0 210px

  .edit-interface
    flex: 1 1 auto

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
