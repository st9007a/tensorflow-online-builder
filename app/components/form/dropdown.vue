<template lang="pug">
sui-form-field.v-dropdown
  label {{propName}}
  sui-dropdown(selection, :placeholder='placeholder', :options='options', v-model='propValue')
</template>

<script>
import base from './base.js'
export default {
  name: 'Dropdown',

  mixins: [base],

  props: ['placeholder', 'options'],

}
</script>

<style lang="sass" scoped>
</style>
