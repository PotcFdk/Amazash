<template>
  <table>
    <thead>
    <tr>
      <th>quantity</th>
      <th>outside Amazon</th>
      <th></th>
      <th>on Amazon</th>
      <th>verdict</th>
    </tr>
    </thead>
    <tbody id="result_calculation_body">
      <tr v-for="item in table" v-bind:class="{ 'threshold-result': item.red }">
        <td>{{ item.quantity.toString() }}</td>
        <td>{{ ooaPriceModel.mul(item.quantity).plus(ooaShippingModel) }} - {{ calculate_outside_amazon_points(item.quantity, ooaPriceModel, ooaShippingModel).div(100) }} = {{ item.ooa.toFixed(2) }}</td>
        <td>{{ item.ooa.greaterThan(item.a) ? '>' : item.ooa.lessThan(item.a) ? '<' : '=' }}</td>
        <td>{{ aPriceModel.mul(item.quantity).plus(aShippingModel) }} - {{ calculate_amazon_points(item.quantity, aPriceModel, aShippingModel).div(100) }} = {{ item.a.toFixed(2) }}</td>
        <td>{{ (item.ooa.greaterThanOrEqualTo(item.a) ? `Amazon wins! (δ = ${item.ooa.minus(item.a)})` : `Outside of Amazon wins! (δ = ${item.a.minus(item.ooa)})`) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue'
import Decimal from 'decimal.js'

interface ResultTableEntry {
  quantity:number;
  ooa:Decimal;
  a:Decimal;
  red?:boolean;
}

export default Vue.extend({
  name: "resulttable",
  data: function() {
    return {
      calculate_amazon_points: this.calculator.calculate_amazon_points,
      calculate_outside_amazon_points: this.calculator.calculate_outside_amazon_points
    }
  },
  props: [
      'calculator', 'threshold', 'ooaPrice', 'ooaShipping', 'aPrice', 'aShipping'
  ],
  computed: {
    ooaPriceModel:    { get():Decimal { return this.ooaPrice    || new Decimal(0) } },
    ooaShippingModel: { get():Decimal { return this.ooaShipping || new Decimal(0) } },
    aPriceModel:      { get():Decimal { return this.aPrice      || new Decimal(0) } },
    aShippingModel:   { get():Decimal { return this.aShipping   || new Decimal(0) } },
    table: {
      get() :ResultTableEntry[] {
        return [-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5]
            .map(offset => offset + 11-Math.max(Math.min(this.threshold, 10), 0))
            .map(offset => <ResultTableEntry>({
                  quantity: this.threshold+offset,
                  ooa: this.calculator.calculate_outside_amazon(this.threshold+offset, this.ooaPrice, this.ooaShipping),
                  //ooa_string: `(${x+offset}*${ooa_price} + ${ooa_shipping}) - ${cashback_outside_amazon * 100} % cashback`,
                  a: this.calculator.calculate_amazon(this.threshold+offset, this.aPrice, this.aShipping),
                  //a_string: `(${x+offset}*${a_price} + ${a_shipping}) - ${cashback_amazon * 100} % cashback`,
                  red: !offset
                })
            )
      }
    }
  }
})
</script>

<style scoped>

</style>