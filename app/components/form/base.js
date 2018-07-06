export default {
  props: ['propName'],

  computed: {

    propValue: {
      get() {
        return this.$store.state.editTargetProps[this.propName].value
      },
      set(value) {
        this.$store.commit('editProps', { key: this.propName, value: value })
      },
    },

  },
}
