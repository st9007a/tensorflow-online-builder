<template lang="pug">
.v-pages
  slot(v-if='activePage==page', v-for='page in pages', :name='page')
</template>

<script>
export default {
  name: 'Pages',

  props: ['pages', 'activePage']
}
</script>

<style lang="sass" scoped>
</style>
