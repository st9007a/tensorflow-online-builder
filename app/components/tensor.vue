<template lang="pug">
g.v-tensor(:transform='position')
  g(@mousedown='moveStart($event); clickStart();', @mouseup='clickEnd($event)')
    rect.tensor(
      v-bind='isFocus(hash, focus) ? style.stroke.focus : style.stroke.default',
      :fill='color.fill',
      :width='rect.width',
      :height='rect.height',
      stroke-width='5',
      rx='10',
      ry='10',
    )
    text(ref='text', v-bind='style.font', font-weight='bold') {{displayName}}
  text(x = -5, y = -5, font-weight='bold', font-size='18') {{tfFunction}}
  circle.in(
    v-for='(n, idx) in inCount',
    cx='0',
    :cy='posY(inCount, idx)',
    r='5',
    fill='white',
    stroke='black',
    stroke-width='4'
  )
  circle.out(
    v-for='(n, idx) in outCount',
    :cx='width',
    :cy='posY(outCount, idx)',
    r='5',
    fill='white',
    stroke='black',
    stroke-width='4'
  )
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Tensor',

  props: ['color', 'propstemplate', 'height', 'width', 'value', 'hash', 'inCount', 'outCount', 'tfFunction'],

  data() {
    return {
      clickStartTimestamp: null,
      focus: false,
      moving: false,
      props: {},
      rect: {
        width: 0,
        height: 0,
        x: 10,
        y: 10,
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
      return `translate(${this.$data.rect.x}, ${this.$data.rect.y})`
    },

    displayName() {
      return this.$data.props.name.value.length > 8 ?
        `${this.$data.props.name.value.substring(0, 8)}...` : this.$data.props.name.value
    },

    ...mapGetters(['isFocus']),

  },

  created() {
    this.$data.style.stroke.default.stroke = this.color.border
    this.$set(this.$data, 'rect', { width: this.width, height: this.height, x: 10, y: 10 })

    for (const k in this.propstemplate) {
      this.$set(this.$data.props, k, this.propstemplate[k])
    }
  },

  mounted() {
    this.fixFontPosition()
  },

  updated() {
    this.fixFontPosition()
  },

  methods: {

    fixFontPosition() {
      let { width, height } = this.$refs.text.getBBox()
      this.$data.style.font.x = (this.$data.rect.width - width) / 2 + 2.5
      this.$data.style.font.y = (this.$data.rect.height - 10) / 2 + height / 2
    },

    highlight() {
      this.$data.focus = !this.$data.focus

      if (this.$data.focus) {
        this.$store.commit('focus', {hash: this.hash, props: this.$data.props})
      } else {
        this.$store.commit('unfocus')
      }
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

        this.$data.rect.x = newPt.x - this.width / 2
        this.$data.rect.y = newPt.y - this.height / 2

        this.$emit('input', this.$data.rect)
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
