<template lang="pug">
.v-builder
  sui-menu.menu(vertical, secondary)
    sui-menu-item(v-for='(cls, idx) in list', :key='cls.name')
      sui-menu-header(@click='toggle(idx)') {{cls.name}}
      sui-menu-menu(v-if='idx == activeIdx')
        a(is='sui-menu-item', v-for='item in cls.list', :key='item', @click='createTensor(item)') {{item}}
  svg.edit-interface(
    @mousewheel='scale',
    @mousedown='translateStart',
    @mouseup='translateEnd',
    @mousemove='translate',
    @dblclick='transformReset',
  ): g(:transform='getTransform')
    path(
      v-for='(conn, id) in connections',
      :d='getPath(conn)',
      stroke='black',
      stroke-width='5',
      @dblclick='removePath(id)',
    )
    v-tensor(
      v-for='(t, id) in tensors',
      v-model='t.coord',
      :key='id',
      :hash='id',
      :color='t.color',
      :propstemplate='t.props',
      :height='t.rect.height',
      :width='t.rect.width',
      :inputs='t.inputs',
      :outputs='t.outputs',
      :tfFunction='t.function',
      :transform='transform',
      @clickPoint='drawConnection',
    )
  sui-segment.config-interface
    sui-form.form
      sui-header(v-if='tensors[editTarget]') {{tensors[editTarget].function}}
      template(v-for='(p, k) in editTargetProps')
        v-dropdown(v-if='p.type == "dtype"', placeholder='Data Type', :options='dtype', :propName='k')
        v-checkbox(v-else-if='p.type=="boolean"', :propName='k')
        v-shape(v-else-if='p.type=="tuple"', :propName='k')
        v-input(v-else, :propName='k')
    sui-button.remove-btn(v-if='tensors[editTarget]', basic, negative, @click.native='removeTensor(editTarget)') Delete
</template>

<script>
import { mapState }  from 'vuex'
import { cloneDeep } from 'lodash'
import SHA256 from 'crypto-js/sha256'

import Tensor   from './tensor.vue'
import Input    from './form/input.vue'
import Dropdown from './form/dropdown.vue'
import CheckBox from './form/checkbox.vue'
import Shape    from './form/shape.vue'

import dtype        from '../res/dtype.json'
import tensorConfig from '../res/tensor.config.json'
import tensorList   from '../res/tensor.list.json'

export default {
  name: 'Builder',

  props: ['value'],

  components: {
    'v-input': Input,
    'v-tensor': Tensor,
    'v-dropdown': Dropdown,
    'v-checkbox': CheckBox,
    'v-shape': Shape,
  },

  data() {
    return {
      connections: {},
      activeIdx: -1,
      drawConn: {
        i: null,
        o: null,
      },
      dtype: [],
      list: [],
      tensors: {},
      transform: {
        moving: false,
        prevX: null,
        prevY: null,
        scale: 1,
        x: 0,
        y: 0,
      },
    }
  },

  computed: {

    getTransform() {
      return `translate(${this.$data.transform.x}, ${this.$data.transform.y}) scale(${this.$data.transform.scale})`
    },

    ...mapState(['editTarget', 'editTargetProps'])

  },

  created() {
    this.$data.dtype = dtype
    this.$data.list = tensorList
  },

  methods: {

    createTensor(name) {
      let template = cloneDeep(tensorConfig[name])
      const id = SHA256(template.props.name.value + (new Date()).toJSON()).toString()

      template.props.name.value = id.substring(0, 6)
      template.coord = {}

      this.$set(this.$data.tensors, id, template)
    },

    drawConnection(connInfo) {
      this.$data.drawConn[connInfo.io] = { hash: connInfo.hash, idx: connInfo.idx }

      if (this.$data.drawConn.i != null && this.$data.drawConn.o != null) {

        const id = SHA256(`${this.$data.drawConn.i.hash}-${this.$data.drawConn.i.idx}-${this.$data.drawConn.o.hash}-${this.$data.drawConn.o.idx}`).toString()

        this.$set(this.$data.connections, id, {
          i: {
            hash: this.$data.drawConn.i.hash,
            idx: this.$data.drawConn.i.idx,
          },
          o: {
            hash: this.$data.drawConn.o.hash,
            idx: this.$data.drawConn.o.idx,
          },
        })

        this.$data.drawConn.i = null
        this.$data.drawConn.o = null
      }

    },

    getPath(conn) {
      const startDeltaX = this.$data.tensors[conn.o.hash].coord.o[conn.o.idx].deltaX,
            startDeltaY = this.$data.tensors[conn.o.hash].coord.o[conn.o.idx].deltaY,
            startX = this.$data.tensors[conn.o.hash].coord.x,
            startY = this.$data.tensors[conn.o.hash].coord.y,
            endDeltaX = this.$data.tensors[conn.i.hash].coord.i[conn.i.idx].deltaX,
            endDeltaY = this.$data.tensors[conn.i.hash].coord.i[conn.i.idx].deltaY,
            endX = this.$data.tensors[conn.i.hash].coord.x,
            endY = this.$data.tensors[conn.i.hash].coord.y

      return `M${startX + startDeltaX + 2} ${startY + startDeltaY} L${endX + endDeltaX - 2} ${endY + endDeltaY}`
    },

    removePath(id) {
      this.$delete(this.$data.connections, id)
    },

    removeTensor(id) {
      this.$store.commit('unfocus')

      for (const connId in this.$data.connections) {
        if (this.connections[connId].i.hash == id || this.connections[connId].o.hash == id) {
          this.removePath(connId)
        }
      }

      this.$delete(this.$data.tensors, id)
    },

    toggle(idx) {
      this.$data.activeIdx = this.$data.activeIdx == idx ? -1 : idx
    },

    transformReset(e) {
      if (e.target.tagName != 'svg') {
        return
      }

      this.$data.transform.x = 0
      this.$data.transform.y = 0
      this.$data.transform.scale = 1
      this.$data.transform.prevX = null
      this.$data.transform.prevY = null

    },

    scale(e) {
      this.$data.transform.scale -= Math.sign(e.deltaY) * 0.25
      this.$data.transform.scale = Math.max(0.25, Math.min(2.5, this.$data.transform.scale))
    },

    translateStart(e) {
      if (e.target.tagName == 'svg') {
        this.$data.transform.moving = true
      }
    },

    translateEnd(e) {
      this.$data.transform.moving = false
      this.$data.transform.prevX = null
      this.$data.transform.prevY = null
    },

    translate(e) {
      if (!this.$data.transform.moving) {
        return
      }

      const svgRoot = e.currentTarget.closest('svg')
      const point = svgRoot.createSVGPoint()
      const ctm = svgRoot.getScreenCTM()

      point.x = e.clientX
      point.y = e.clientY

      const rect = point.matrixTransform(ctm.inverse())

      if (this.$data.transform.prevX != null && this.$data.transform.prevY != null) {
        this.$data.transform.x += (rect.x - this.$data.transform.prevX) * this.$data.transform.scale
        this.$data.transform.y += (rect.y - this.$data.transform.prevY) * this.$data.transform.scale
      }

      this.$data.transform.prevX = rect.x
      this.$data.transform.prevY = rect.y
    },

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
    flex: 0 0 150px

  .edit-interface
    flex: 1 1 auto

  .ui.segment
    flex: 0 0 300px
    margin: 0 0 0 1.5rem

svg
  border: 4px solid rgba(0, 0, 0, .8)
  border-radius: 15px

.menu
  font-size: 1.2rem

.config-interface
  display: flex
  flex-direction: column
  overflow-y: auto

  .form
    flex: 1

  .remove-btn
    flex: 0 0 36px
    margin-top: 3rem

</style>
