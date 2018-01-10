<template lang="pug">
.v-builder
  .ui.left.secondary.vertical.menu
    .item(v-for='(items, idx) in list', @click='toggle(idx)')
      .header {{items.name}}
      transition(name='fade')
        .menu(v-if='idx == currentListIdx')
          a.item(v-for='item in items.list') {{item.name}}
  svg.edit-interface
</template>

<script>
export default {
  name: 'Builder',

  data() {
    return {
      currentListIdx: -1,
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
    }
  },
}
</script>

<style lang="sass" scoped>
.v-builder
  height: 100%
  display: flex

  .ui.menu
    flex: 0 0 210px

  .edit-interface
    flex: 1 1 auto

.item
  font-size: 1.2em

.fade-enter-active
  transition: opacity .2s

.fade-leave-active
  transition: opacity .3s

.fade-enter, .fade-leave-to
  opacity: 0

a.item
</style>
