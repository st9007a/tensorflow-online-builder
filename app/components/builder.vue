<template lang="pug">
.v-builder
  .ui.left.secondary.vertical.menu
    .item(v-for='(cls, idx) in list', @click='toggle(idx)')
      .header {{cls.name}}
      transition(name='fade')
        .menu(v-if='idx == currentListIdx')
          a.item(v-for='item in cls.list', @dblclick='createTensor(item.name)') {{item.name}}
  svg.edit-interface
    .flow(
      is='v-flow',
      v-for='(f, name) in flows',
      :startX='f.start.x',
      :startY='f.start.y',
      :endX='f.end.x',
      :endY='f.end.y',
    )
    .tensor(
      is='v-tensor',
      v-for='(t, name) in tensors',
      v-model='t.pos',
      :color='t.color',
      :border='t.border',
      :width='t.width',
      :height='t.height',
      :inCount='t.inCount',
      :outCount='t.outCount',
      :name='name',
      @move='reDrawPath',
      @onClickPoint='drawPath',
    )
</template>

<script>
import tensorConfig from '../res/tensor.config.json'
import Tensor from './tensor.vue'
import Flow from './flow.vue'
export default {
  name: 'Builder',

  components: {
    'v-flow': Flow,
    'v-tensor': Tensor,
  },

  created() {
    for (const name in tensorConfig) {
      this.$set(this.$data.count, name, 0)
    }
  },

  data() {
    return {
      currentListIdx: -1,
      count: {
        flow: 0,
      },
      createFlow: '',
      tensors: {
        Const_0: {
          color: '#63b5b5',
          border: '#1e8080',
          width: 120,
          height: 60,
          inCount: 0,
          outCount: 1,
          pos: {
            x: 10,
            y: 10,
          },
        },
        Matmul_0: {
          color: '#ffba7e',
          border: '#d57e32',
          width: 120,
          height: 90,
          inCount: 2,
          outCount: 1,
          pos: {
            x: 250,
            y: 20,
          },
        },
      },
      flows: {
        flow_0: {
          end: {
            name: 'Matmul_0',
            idx: 0,
            x: 200,
            y: 200,
          },
          start: {
            name: 'Const_0',
            idx: 0,
            x: 10,
            y: 10,
          },
        },
      },
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

    createTensor(name) {
      const config = tensorConfig[name]
      this.$set(this.$data.tensors, config.name + '_' + (++this.$data.count[name]), {
        border: config.border,
        color: config.color,
        height: config.height,
        inCount: config.inCount,
        outCount: config.outCount,
        pos: {
          x: config.pos.x,
          y: config.pos.y,
        },
        width: config.width,
      })
    },

    drawPath(pos) {
      // return
      const flowName = this.$data.createFlow === '' ? 'flow_' + (++this.$data.count.flow) : this.$data.createFlow
      this.$data.createFlow = this.$data.createFlow === '' ? flowName : ''
      let flowConfig = {
        start: this.$data.createFlow === '' ? this.$data.flows[flowName].start : { x: pos.x, y: pos.y },
        end: { x: pos.x, y: pos.y },
      }
      this.$set(this.$data.flows, flowName, flowConfig)
    },

    reDrawPath(info) {
    }


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
