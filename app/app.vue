<template lang="pug">
.v-app
  div.head
    sui-header.title(size='large')
      | Tensorflow Builder
      sui-header-subheader A Online Tensorflow Graph Editor
    div.right
      sui-button(basic, floated='right', color='violet', @click.native='exportPanel.open = !exportPanel.open') Export
      sui-modal(v-model='exportPanel.open')
        sui-modal-header Export Settings
        sui-modal-content
          sui-modal-description
            sui-header Select program language
            sui-dropdown(placeholder='Program Language', selection, :options='exportPanel.programList', v-model='exportConfig.program')
            sui-header Export as
            sui-dropdown(placeholder='Export as', selection, :options='exportPanel.exportTypeList', v-model='exportConfig.as')
        sui-modal-actions
          div(is='sui-button-group')
            sui-button Cancel
            sui-button-or
            sui-button(positive) Export
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
      exportPanel: {
        open: false,
        programList: [
          { text: 'Python3', value: 'Python3' },
        ],
        exportTypeList: [
          { text: 'Function', value: 'Function' },
          { text: 'Class', value: 'Class' },
        ],
      },
      exportConfig: {
        program: null,
        as: null,
      },
    }
  },
}
</script>

<style lang="sass" scoped>
.v-app
  display: flex
  flex-direction: column
  height: 100%

  .head
    display: flex
    flex: 0 0 65px
    margin: 0em 0.5em 1em 0.5em

    *
      user-select: none

    .title
      flex: 1

    .right
      flex: 0 0 300px

  .v-builder
    flex: 1 1 auto

  padding: 3rem
</style>
