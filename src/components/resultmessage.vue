<template>
  <span class="resultmessage">{{result}}</span>
</template>

<script lang="ts">
import Vue from 'vue'
import {OrderPlace} from "../calculate";

export default Vue.extend({
  name: "resultmessage",
  props: ['optimizationResult'],
  computed: {
    result: {
      get () :string {
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
  }
})
</script>

<style scoped>

</style>