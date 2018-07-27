<template lang="pug">
g.v-tensor(:transform='position')
  g(@mousedown='moveStart($event); clickStart();', @mouseup='clickEnd($event)')
    rect.tensor(
      v-bind='isFocus(hash, focus) ? style.stroke.focus : style.stroke.default',
      :fill='color.fill',
      :width='width',
      :height='height',
      stroke-width='5',
      rx='10',
      ry='10',
    )
    text(ref='text', v-bind='style.font', font-weight='bold') {{displayName}}
  text(x = -5, y = -5, font-weight='bold', font-size='18') {{tfFunction}}
  circle.in(
    v-for='(n, idx) in inputs',
    cx='0',
    :cy='posY(inputs.length, idx)',
    r='5',
    fill='white',
    stroke='black',
    stroke-width='4',
    @click='clickPoint($event, "i", idx)',
  )
  circle.out(
    v-for='(n, idx) in outputs',
    :cx='width',
    :cy='posY(outputs.length, idx)',
    r='5',
    fill='white',
    stroke='black',
    stroke-width='4',
    @click='clickPoint($event, "o", idx)',
  )
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Tensor',

  props: [
    'color',
    'propstemplate',
    'height',
    'width',
    'value',
    'hash',
    'inputs',
    'outputs',
    'tfFunction',
    'transform',
  ],

  data() {
    return {
      clickStartTimestamp: null,
      focus: false,
      moving: false,
      props: {},
      coord: {
        x: 30,
        y: 30,
        i: [],
        o: [],
      },
      style: {
        font: {
          'font-size': 20,
          x: 0,
          y: 0,
        },
        stroke: {
          default: {
            stroke: 'black',
            'stroke-dasharray': '0, 0',
          },
          focus: {
            stroke: 'black',
            'stroke-dasharray': '10, 4',
          },
        },
      },
    }
  },

  computed: {

    position() {
      return `translate(${this.$data.coord.x}, ${this.$data.coord.y})`
    },

    displayName() {
      return this.$data.props.name.value.length > 8 ?
        `${this.$data.props.name.value.substring(0, 8)}...` : this.$data.props.name.value
    },

    ...mapGetters(['isFocus']),

  },

  created() {
    this.$data.style.stroke.default.stroke = this.color.border

    for (let i = 0; i < this.inputs.length; i++) {
      this.$data.coord.i.push({ deltaX: 0, deltaY: this.posY(this.inputs.length, i) })
    }

    for (let i = 0; i < this.outputs.length; i++) {
      this.$data.coord.o.push({ deltaX: this.width, deltaY: this.posY(this.outputs.length, i) })
    }

    for (const k in this.propstemplate) {
      this.$set(this.$data.props, k, this.propstemplate[k])
    }

    this.$emit('input', this.$data.coord)
  },

  mounted() {
    this.fixFontPosition()
  },

  updated() {
    this.fixFontPosition()
  },

  methods: {

    fixFontPosition() {
      // Prevent the vue bug: call updated hook after component destory
      if (this.$refs.text === undefined) {
        return
      }

      let { width, height } = this.$refs.text.getBBox()
      this.$data.style.font.x = (this.width - width) / 2 + 2.5
      this.$data.style.font.y = (this.height - 10) / 2 + height / 2
    },

    highlight() {
      this.$data.focus = !this.$data.focus

      if (this.$data.focus) {
        this.$store.commit('focus', {hash: this.hash, props: this.$data.props})
      } else {
        this.$store.commit('unfocus')
      }
    },

    clickPoint(e, io, idx) {
      const svgRoot = e.currentTarget.closest('svg')
      const point = svgRoot.createSVGPoint()
      const ctm = svgRoot.getScreenCTM()

      point.x = e.clientX
      point.y = e.clientY

      const rect = point.matrixTransform(ctm.inverse())

      this.$emit('clickPoint', {
        hash: this.hash,
        io: io,
        idx: idx,
      })
    },

    clickStart() {
      this.$data.clickStartTimestamp = new Date()
    },

    clickEnd(e) {
      if ((new Date()) - this.$data.clickStartTimestamp <= 100 && e.button == 0) {
        this.highlight()
      }
    },

    moveStart(e) {
      const elem = e.currentTarget.parentElement.closest('svg')
      const point = elem.createSVGPoint()
      const transform = elem.getScreenCTM().inverse()

      this.$data.moving = true

      const updateFn = () => {
        if (this.$data.moving) {
          requestAnimationFrame(updateFn)
        }

        const newPt = point.matrixTransform(transform)

        this.$data.coord.x = (newPt.x - this.transform.x) / this.transform.scale - this.width / 2
        this.$data.coord.y = (newPt.y - this.transform.y) / this.transform.scale - this.height / 2

        this.$emit('input', this.$data.coord)
      }

      const moveFn = (evt) => {
        point.x = evt.clientX
        point.y = evt.clientY
      }

      const stopFn = (evt) => {
        this.$data.moving = false
        elem.removeEventListener('mousemove', moveFn)
        elem.removeEventListener('mouseup', stopFn)
        elem.removeEventListener('mouseleave', stopFn)
      }

      requestAnimationFrame(updateFn)
      moveFn(e)

      elem.addEventListener('mousemove', moveFn)
      elem.addEventListener('mouseup', stopFn)
      elem.addEventListener('mouseleave', stopFn)
    },

    posY(total, idx) {
      return this.height / (total + 1) * (idx + 1)
    },

  },

}
</script>

<style lang="sass" scoped>
</style>
