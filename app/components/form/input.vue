<template lang="pug">
sui-form-field.v-input
  label {{propName}}
  input(type='text', v-model='propValue')
</template>

<script>
import base from './base.js'
export default {
  name: 'Input',

  mixins: [base],
}
</script>

<style lang="sass" scoped>
</style>
