<template>
  <span class="resultmessage">{{result}}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {OptimizationResult, OrderPlace} from "../calculate";

export default defineComponent({
  name: "resultmessage",
  props: {
    optimizationResult: {
      type: OptimizationResult,
      default: new OptimizationResult()
    }
  },
  computed: {
    result(): string {
      return this.optimizationResult.threshold > 1 ? ( // > 1: depends on x
            this.optimizationResult.orderPlace == OrderPlace.Outside
                ? `It makes sense to buy outside Amazon when quantity >= ${this.optimizationResult.threshold}`
                : `It makes sense to buy on Amazon when quantity >= ${this.optimizationResult.threshold}`
        )
        : ( // <= 1: does not depend on x; valid from x=1 on (a.k.a. "always")
            this.optimizationResult.orderPlace == OrderPlace.Outside
                ? `With these parameters, it always makes sense to buy outside of Amazon.`
                : `With these parameters, it always makes sense to buy on Amazon.`
        );
    }
  }
})
</script>

<style scoped>

</style>