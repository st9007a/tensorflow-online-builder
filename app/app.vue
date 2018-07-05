<template lang="pug">
.v-app
  .ui.header.item
    i.configure.icon
    .content
      | Tensorflow Builder
      .sub.header A Online Tensorflow Graph Editor
  v-builder
</template>

<script>
import Builder from './components/builder_new.vue'
export default {
  name: 'App',

  components: {
    'v-builder': Builder,
  },

  data() {
    return {
    }
  },
}
</script>

<style lang="sass" scoped>
.v-app
  display: flex
  flex-direction: column
  height: 100%

  .ui.header
    flex: 0 0 65px
    margin: 0em 1em 1em 1em

    *
      user-select: none

  .v-builder
    flex: 1 1 auto

  padding: 3rem
</style>
