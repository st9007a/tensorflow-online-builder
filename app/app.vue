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
  .container
    .ui.left.secondary.vertical.menu
      a.item Basic Op
      a.item Math Op
      a.item NN Op
      a.item Layer Op
      a.item Dataset API
      a.item Queue
    v-pages(:pages='pages', :activePage='currentPage')
      .page(slot='intro')
        include templates/intro.pug
      .page(slot='start')
        include templates/start.pug
      .page(slot='try') Try It !
</template>

<script>
import Pages from './components/pages.vue'
export default {
  name: 'App',

  components: {
    'v-pages': Pages,
  },

  data() {
    return {
      currentPage: 'intro',
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
.ui.secondary.menu:first-child
  margin-left: 1em
  margin-right: 1em

.container
  display: flex

  .ui.vertical.menu
    margin-top: 5em
    flex: 0 0 210px

    a.item
      padding-left: 2rem

  .page
    flex: 1 1 auto
    padding: 3rem
</style>
