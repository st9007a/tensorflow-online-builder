<template lang="pug">
.v-builder
  .ui.left.secondary.vertical.menu
    .item(v-for='(items, idx) in list', @click='toggle(idx)')
      .header {{items.name}}
      transition(name='fade')
        .menu(v-if='items.open')
          a.item(v-for='item in items.list') {{item.name}}
  svg.edit-interface
</template>

<script>
export default {
  name: 'Builder',

  data() {
    return {
      list: [
        {
          name: 'Basic Op',
          open: false,
          list: [
            { name: 'Placeholder' },
            { name: 'Constant' },
            { name: 'Variable' },
          ],
        },
        {
          name: 'Math Op',
          open: false,
          list: [
            { name: 'Log' },
            { name: 'Matmul' },
            { name: 'Add' }
          ],
        }
      ]
    }
  },

  methods: {
    toggle(idx) {
      this.$data.list[idx].open = !this.$data.list[idx].open
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

.fade-enter-active, .fade-leave-active
  transition: opacity .2s

.fade-enter, .fade-leave-to
  opacity: 0

a.item
</style>
