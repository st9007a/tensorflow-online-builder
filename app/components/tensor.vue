<template lang="pug">
rect.v-tensor(
  v-bind='pos'
  :fill='color',
  @mousedown='startMove',
  rx='10',
  ry='10',
  width='120',
  height='60',
)
</template>

<script>
export default {
  name: 'Tensor',

  props: ['color'],

  data() {
    return {
      moving: false,
      pos: {
        x: 0,
        y: 0,
      },
    }
  },

  methods: {

    startMove(e) {
      const elem = e.currentTarget.closest('svg')
      const point = elem.createSVGPoint()
      const transform = elem.getScreenCTM().inverse()

      this.$data.moving = true
      let newPt

      const updateFn = () => {
        if (this.$data.moving) requestAnimationFrame(updateFn)

        newPt = point.matrixTransform(transform)
        this.$data.pos.x = newPt.x - 60
        this.$data.pos.y = newPt.y - 30
      }

      const moveFn = (evt) => {
        point.x = evt.clientX
        point.y = evt.clientY
      }

      const stopFn = (e) => {
        this.$data.moving = false
        elem.removeEventListener('mousemove', moveFn)
        elem.removeEventListener('mouseup', stopFn)
      }

      requestAnimationFrame(updateFn)
      moveFn(e)

      elem.addEventListener('mousemove', moveFn)
      elem.addEventListener('mouseup', stopFn)
    },

  },
}
</script>

<style lang="sass" scoped>
</style>
