<template lang="pug">
sui-form-field.v-checkbox
  sui-checkbox(toggle, :label='propName', v-model='propValue')
</template>

<script>
import base from './base.js'
export default {
  name: 'CheckBox',

  mixins: [base],
}
</script>

<style lang="sass" scoped>
</style>
