<template>
  <p>
    <select v-model="selectedModel">
      <option v-for="configuration in configurations" v-bind:key="configuration.name" v-bind:value="configuration">
        {{ configuration.name }}: {{ configuration.Amazon }} % / {{ configuration.Outside/2 }} %
      </option>
    </select>
    <br>
    <span>Amazon cashback: {{ selectedModel.Amazon }} %, Outside cashback: {{ selectedModel.Outside/2 }} %</span>
  </p>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {AmazonBonusConfiguration, configurations} from '../calculate'

export default defineComponent({
  name: "configurationselector",
  props: {
    selected: {
      type: Object as PropType<AmazonBonusConfiguration>,
      default: configurations.DE_Prime
    },
    configurations: Object as PropType<AmazonBonusConfiguration[]>
  },
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