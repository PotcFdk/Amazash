<template>
  <div>Version: {{ version }} from {{ date }}</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "versioninformation",
  props: [
      'version', 'commitTimestamp'
  ],
  computed: {
    date: {
      get():string {
        return new Date(this.commitTimestamp).toUTCString()
      }
    }
  }
})
</script>

<style scoped>

</style>