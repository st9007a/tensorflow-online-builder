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
            sui-button(@click.native='exportPanel.open = false') Cancel
            sui-button-or
            sui-button(positive, @click.native='generateCode') Export
  v-builder(v-model='graphStruct')
</template>

<script>
import { cloneDeep } from 'lodash'
import { Pool } from './lib/collection'
import Builder from './components/builder.vue'
export default {
  name: 'App',

  components: {
    'v-builder': Builder,
  },

  data() {
    return {
      graphStruct: null,
      exportPanel: {
        open: false,
        programList: [
          { text: 'Python3', value: 'Python3' },
        ],
        exportTypeList: [
          { text: 'Function', value: 'Function' },
        ],
      },
      exportConfig: {
        program: null,
        as: null,
      },
    }
  },

  methods: {

    generateCode() {
      const { tensors, connections } = cloneDeep(this.$data.graphStruct)
      const entryNode = new Pool()
      const stashPool = new Pool()
      const sortedConnections = []

      const pushConnectionByTensorId = (tensorId) => {
        for (const k in connections) {
          if (connections[k].o.hash === tensorId) {
            sortedConnections.push(k)

            const nextTensorId = connections[k].i.hash

            if (tensors[nextTensorId].connect.parents == 1) {
              pushConnectionByTensorId(nextTensorId)
            } else {
              tensors[nextTensorId].connect.parents--
            }

            break
          }
        }
      }

      // Find all entry node
      for (const id in tensors) {
        if (tensors[id].connect.parents == 0) {
          entryNode.add(id)
        }
      }

      // Sort connections
      while (!entryNode.isEmpty()) {
        const tensorId = entryNode.pick()
        entryNode.remove(tensorId)

        pushConnectionByTensorId(tensorId)

      }

    },

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
