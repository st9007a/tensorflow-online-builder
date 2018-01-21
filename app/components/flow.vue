<template lang="pug">
path.v-flow(:d='getPath', stroke='black', stroke-width='5')
</template>

<script>
export default {
  name: 'Flow',

  props: ['startX', 'startY', 'endX', 'endY'],

  created() {
    this.$set(this.$data, 'path', {
      startX: this.startX,
      startY: this.startY,
      endX: this.endX,
      endY: this.endY,
    })
  },

  computed: {
    getPath() {
      return `M${this.$data.path.startX} ${this.$data.path.startY} L${this.$data.path.endX} ${this.$data.path.endY}`
    },
  },

  data() {
    return {
      path: {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
      }
    }
  },

  watch: {
    startX(val) {
      this.$data.path.startX = val
    },

    startY(val) {
      this.$data.path.startY = val
    },

    endX(val) {
      this.$data.path.endX = val
    },

    endY(val) {
      this.$data.path.endY = val
    },
  }

}
</script>

<style lang="sass" scoped>
</style>
