<template lang="pug">
g.v-tensor(:transform='pos')
  rect.tensor(
    v-bind='strokeStyle',
    :fill='color',
    @mousedown='startMove',
    @dblclick='highlight',
    stroke-width='5',
    rx='10',
    ry='10',
    width='120',
    height='60',
  )
  circle.in(cx='0', cy='30', r='5', stroke='black', fill='white', stroke-width='4')
  circle.out(cx='120', cy='30', r='5', stroke='black', fill='white', stroke-width='4')
  <!-- path.flow(v&#45;if='connect', d='M124 30 L150 30', stroke='black', stroke&#45;width='5') -->
</template>

<script>
export default {
  name: 'Tensor',

  props: ['color', 'border'],

  data() {
    return {
      props: {
        name: '',
      },
      moving: false,
      pos: 'translate(10, 10)',
      focus: false,
      strokeStyle: {
        'stroke-dasharray': '0, 0',
        stroke: '',
      },
      connect: false,
    }
  },

  created() {
    this.$data.strokeStyle.stroke = this.border
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
        this.$data.pos = `translate(${newPt.x - 60}, ${newPt.y - 30})`
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

  },
}
</script>

<style lang="sass" scoped>
</style>
