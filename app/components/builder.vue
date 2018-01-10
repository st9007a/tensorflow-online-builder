<template lang="pug">
.v-builder
  .ui.left.secondary.vertical.menu
    a.item Basic Op
    a.item Math Op
    a.item NN Op
    a.item Layers
    a.item Dataset
    a.item Queue
    a.item Metrics
  svg.edit-interface
</template>

<script>
export default {
  name: 'Builder',
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
</style>
