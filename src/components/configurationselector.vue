<template>
  <p>
    <select v-model="selectedModel">
      <option v-for="configuration in configurations" v-bind:value="configuration">
        {{ configuration.name }}: {{ configuration.Amazon }} % / {{ configuration.Outside/2 }} %
      </option>
    </select>
    <br>
    <span>Amazon cashback: {{ selectedModel.Amazon }} %, Outside cashback: {{ selectedModel.Outside/2 }} %</span>
  </p>
</template>

<script lang="ts">
import Vue from 'vue'
import {AmazonBonusConfiguration} from '../calculate'

export default Vue.extend({
  name: "configurationselector",
  props: ['selected', 'configurations'],
  computed: {
    selectedModel: {
      get (): AmazonBonusConfiguration { return this.selected },
      set (value: AmazonBonusConfiguration) { this.$emit('update:selected', value) },
    },
  }
})
</script>

<style scoped>

</style>