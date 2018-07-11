<template lang="pug">
sui-form-field.v-shape
  label {{propName}}
  sui-segment.panel(piled)
    sui-form-fields.inline(inline)
      label.shape {{displayShape}}
      sui-button.button(basic, negative, icon='eraser', @click.prevent='removeLast')
    sui-form-fields.inline(inline)
      input(
        v-model='dimension',
        :style='inputState'
        type='text',
        placeholder='Dimension',
        @keydown.enter='addDimension',
      )
      sui-button.button(basic, primary, icon='pencil alternate', @click.prevent='addDimension')
    p.error(v-if='invalid.error') {{invalid.message}}
</template>

<script>
import mexp from 'math-expression-evaluator'

export default {
  name: 'Shape',

  props: ['propName'],

  data() {
    return {
      dimension: '',
      invalid: {
        error: false,
        message: '',
      }
    }
  },

  computed: {

    displayShape() {
      const value = this.$store.state.editTargetProps[this.propName].value

      if (value.length == 0) {
        return 'It is a scalar.'
      }
      return value.join(', ')

    },

    inputState() {
      return this.$data.invalid.error ? {
        'background-color': '#fff6f6',
        'border-color': '#e0b4b4',
        color: '#9f3a38',
      } : {}
    },

  },

  methods: {

    addDimension() {
      if (this.$store.state.editTargetProps[this.propName].value.length < 5 && this.$data.dimension != '') {
        try {
          const value = mexp.eval(this.$data.dimension)

          if (value % 1 !== 0) {
            this.$data.invalid.error = true
            this.$data.invalid.message = 'Result should be integer.'
            return
          }

          this.$store.commit('pushTupleValue', { key: this.propName, value: value })
          this.$data.dimension = ''
          this.$data.invalid.error = false

        } catch (e) {
          this.$data.invalid.error = true
          this.$data.invalid.message = 'Math expression is invalid.'
        }
      }
    },

    removeLast(e) {
      if (e.clientX == 0 && e.clientY == 0) {
        return
      }

      this.$store.commit('popTupleValue',  this.propName)
    },

  },

}
</script>

<style lang="sass" scoped>
.v-shape .panel
  margin-top: 0

label.shape
  font-size: 1em!important
  margin-left: 1em!important

p.error
  margin-left: 1em

.inline
  display: flex

  input, label
    flex: 5

  .button
    flex: 0 0 20px
</style>
