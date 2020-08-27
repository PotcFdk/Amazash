<template>
  <div>Version: {{ version }} from {{ date }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: "versioninformation",
  props: {
    version: String,
    commitTimestamp: {
      type: Number,
      default: 0
    }
  },
  computed: {
    date(): string {
      return new Date(this.commitTimestamp).toUTCString()
    }
  }
})
</script>

<style scoped>

</style>