<template>
  <div>
    <h2>{{title}}:</h2>
    item price for n items = n
    x
    <input v-model.number="priceModel" type="number" @keypress="isNumber($event)" step="0.01" title="price" placeholder="item price" autofocus>
    +
    <input v-model.number="shippingModel" type="number" @keypress="isNumber($event)" step="0.01" placeholder="shipping / constant costs" title="shipping">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Decimal from 'decimal.js'

export default defineComponent({
  props: {
    title: String,
    price: Decimal,
    shipping: Decimal
  },
  methods: {
    isNumber: function (evt: KeyboardEvent) {
      if (evt.key.match(/^[\d,.]$/)) {
        return true;
      } else {
        evt.preventDefault();
      }
    }
  },
  computed: {
    priceModel: {
      get (): number|undefined {  return this.price?.toNumber() },
      set (value: number) { if (value) this.$emit('update:price', new Decimal (value)) },
    },
    shippingModel: {
      get (): number|undefined { return this.shipping?.toNumber() },
      set (value: number) { if (value) this.$emit('update:shipping', new Decimal (value)) },
    }
  }
});
</script>

<style scoped>

</style>