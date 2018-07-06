<template lang="pug">
.v-app
  sui-header.title(size='large')
    | Tensorflow Builder
    sui-header-subheader A Online Tensorflow Graph Editor
  v-builder
</template>

<script>
import Builder from './components/builder.vue'
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

  .title
    flex: 0 0 65px
    margin: 0em 0.5em 1em 0.5em

    *
      user-select: none

  .v-builder
    flex: 1 1 auto

  padding: 3rem
</style>
