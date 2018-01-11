<template lang="pug">
g.v-tensor(:transform='pos')
  rect.tensor(
    v-bind='highlight'
    :fill='color',
    @mousedown='startMove',
    rx='10',
    ry='10',
    width='120',
    height='60',
  )
  circle.in(cx='0', cy='30', r='5', stroke='black', fill='white', stroke-width='4')
  circle.out(cx='120', cy='30', r='5', stroke='black', fill='white', stroke-width='4')
  <!-- g.meta -->
  <!--   rect.props( x='&#45;30', y='&#45;150', width='100', height='300', fill='white', stroke='black') -->
  <!--   text(contentEditable='true', x='10', y='20') test -->
</template>

<script>
export default {
  name: 'Tensor',

  props: ['color'],

  data() {
    return {
      props: {
        name: '',
      },
      moving: false,
      pos: 'translate(10, 10)',
      highlight: {
        stroke: '#1e8080',
        'stroke-width': '5',
        'stroke-dasharray': '10, 4',
      },
    }
  },

  methods: {

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
