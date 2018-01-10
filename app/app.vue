<template lang="pug">
.v-app
  .ui.secondary.menu
    .ui.header.item
      i.configure.icon
      .content
        | Tensorflow Builder
        .sub.header A Online Tensorflow Graph Editor
    .right.item
      a.item(@click='switchPage("intro")') Introduction
      a.item(@click='switchPage("start")') Getting Start
      a.item(@click='switchPage("try")') Try It !
  v-pages(:pages='pages', :activePage='currentPage')
    .page(slot='intro')
      include templates/intro.pug
    .page(slot='start')
      include templates/start.pug
    .page(slot='try')
      v-builder
</template>

<script>
import Builder from './components/builder.vue'
import Pages from './components/pages.vue'
export default {
  name: 'App',

  components: {
    'v-builder': Builder,
    'v-pages': Pages,
  },

  data() {
    return {
      currentPage: 'try',
      pages: ['intro', 'start', 'try'],
    }
  },

  methods: {
    switchPage(page) {
      this.$data.currentPage = page
    }
  },
}
</script>

<style lang="sass" scoped>
.v-app
  display: flex
  flex-direction: column
  height: 100%

  .ui.secondary.menu:first-child
    flex: 0 0 65px
    margin: -2em 1em 0 1em

  .v-pages
    display: flex
    flex: 1 1 auto
    margin-top: 3em

    .page
      flex: 1
  padding: 3rem
</style>
