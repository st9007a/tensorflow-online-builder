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
      createFlow: {
        activate: false,
        name: '',
        startAt: {
          tensor: '',
          type: '',
        },
      },
      tensors: {},
      flows: {},
      list: [
        {
          name: 'Auxiliary',
          list: [
            { name: 'Output' },
          ],
        },
        {
          name: 'Basic Op',
          list: [
            { name: 'Constant' },
            { name: 'Placeholder' },
            { name: 'Variable' },
          ],
        },
        {
          name: 'Math Op',
          list: [
            { name: 'Add' },
            { name: 'Log' },
            { name: 'Matmul' },
          ],
        },
        {
          name: 'NN Op',
          list: [
            { name: 'Relu' },
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
      if (!this.$data.createFlow.activate) {
        this.$set(this.$data, 'createFlow', {
          activate: true,
          name: 'flow_' + (++this.$data.count.flow),
          startAt: {
            type: pos.type,
            tensor: pos.name,
          },
        })
      } else if (pos.type === this.$data.createFlow.startAt.type || pos.name === this.$data.createFlow.startAt.tensor) {
        this.$delete(this.$data.flows, this.$data.createFlow.name)
        this.$set(this.$data.createFlow, 'activate', false)
        return
      } else {
        this.$set(this.$data.createFlow, 'activate', false)
      }

      const { name: flowName } = this.$data.createFlow

      const flowConfig = {
        idx: pos.idx,
        name: pos.name,
        x: pos.x,
        y: pos.y,
      }

      this.$set(this.$data.flows, flowName, {
        start: !this.$data.createFlow.activate ? this.$data.flows[flowName].start : flowConfig,
        end: flowConfig,
      })
    },

    reDrawPath(info) {
      const { pos } = this.$data.tensors[info.name]
      for (const f in this.$data.flows) {
        if (this.$data.flows[f].end.name === info.name) {
          this.$data.flows[f].end.x += info.deltaX
          this.$data.flows[f].end.y += info.deltaY
        } else if (this.$data.flows[f].start.name === info.name) {
          this.$data.flows[f].start.x += info.deltaX
          this.$data.flows[f].start.y += info.deltaY
        }
      }
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
