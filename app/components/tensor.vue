<template lang="pug">
g.v-tensor(:transform='pos')
  g(@mousedown='startMove', @dblclick='highlight')
    rect.tensor(
      v-bind='strokeStyle',
      :fill='color',
      :width='width',
      :height='height',
      stroke-width='5',
      rx='10',
      ry='10',
    )
    text(ref='text', v-bind='fontStyle', font-weight='bold') {{props.name}}
  circle.in(
    v-for='(n, idx) in inCount',
    :cy='posY(inCount, idx)',
    @click='clickInput',
    cx='0',
    r='5',
    fill='white',
    stroke='black',
    stroke-width='4'
  )
  circle.out(
    v-for='(n, idx) in outCount',
    :cx='width',
    :cy='posY(outCount, idx)',
    @click='clickOutput',
    r='5',
    fill='white',
    stroke='black',
    stroke-width='4'
  )
</template>

<script>
export default {
  name: 'Tensor',

  props: ['name', 'color', 'border', 'width', 'height', 'inCount', 'outCount', 'x', 'y'],

  data() {
    return {
      focus: false,
      fontStyle: {
        'font-size': 20,
        x: 0,
        y: 0,
      },
      moving: false,
      pos: 'translate(10, 10)',
      props: {
        name: '',
      },
      strokeStyle: {
        'stroke-dasharray': '0, 0',
        stroke: '',
      },
    }
  },

  created() {
    this.$data.strokeStyle.stroke = this.border
    this.$data.props.name = this.name
    this.$data.pos = `translate(${this.x}, ${this.y})`
  },

  mounted() {
    let { width, height } = this.$refs.text.getBBox()
    if (width > this.width * 5 / 6) {
      this.$set(this.$data.fontStyle, 'font-size', 20 * this.width * 5 / 6 / width)
      width = this.width * 5 / 6
    }
    this.$data.fontStyle.x = (this.width - width) / 2 + 5
    this.$data.fontStyle.y = (this.height - 5) / 2 + height / 2
  },

  methods: {

    highlight() {
      if (!this.$data.focus) {
        this.$data.strokeStyle = {
          stroke: 'black',
          'stroke-dasharray': '10, 4',
        }
      } else {
        this.$data.strokeStyle = {
          stroke: this.border,
          'stroke-dasharray': '0, 0',
        }
      }

      this.$data.focus = !this.$data.focus
    },

    startMove(e) {
      const elem = e.currentTarget.parentElement.closest('svg')
      const point = elem.createSVGPoint()
      const transform = elem.getScreenCTM().inverse()

      this.$data.moving = true

      const updateFn = () => {
        if (this.$data.moving) {
          requestAnimationFrame(updateFn)
        }

        const newPt = point.matrixTransform(transform)
        this.$data.pos = `translate(${newPt.x - this.width / 2}, ${newPt.y - this.height / 2})`
        this.$emit('move', {
          name: this.$data.props.name,
          x: newPt.x - this.width / 2,
          y: newPt.y - this.height / 2,
        })
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

    clickInput() {
      this.$emit('onClickInput')
    },

    clickOutput() {
      this.$emit('onClickOutput')
    },

  },
}
</script>

<style lang="sass" scoped>
</style>
