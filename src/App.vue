<template>
  <div>
    <img src="./assets/amazash.gif" alt="Amazash Logo" class="amazash-logo" />

    <versioninformation v-bind:version="version" v-bind:commit-timestamp="commitTimestamp"></versioninformation>

    <configurationselector v-model:selected="configuration" v-bind:configurations="configurations"></configurationselector>

    <h1 class="demoHeaders">Calculator:</h1>

    <priceinput title="Out-of-Amazon" v-model:price="ooaPrice" v-model:shipping="ooaShipping"></priceinput>
    <priceinput title="Amazon" v-model:price="aPrice" v-model:shipping="aShipping"></priceinput>

    <button v-on:click="resetAll()">RESET</button>

    <resultmessage v-bind:optimization-result="optimizationResult"></resultmessage>
    <resulttable
        v-bind:calculator="calculator"
        v-bind:threshold="optimizationResult.threshold"
        v-bind:ooa-price="ooaPrice" v-bind:ooa-shipping="ooaShipping"
        v-bind:a-price="aPrice" v-bind:a-shipping="aShipping"
    ></resulttable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Decimal from "decimal.js";
import {AmazonBonusCalculator, configurations, OptimizationResult} from "@/calculate";
import configurationselector from "@/components/configurationselector.vue";
import priceinput from "@/components/priceinput.vue";
import resultmessage from "@/components/resultmessage.vue";
import resulttable from "@/components/resulttable.vue";
import versioninformation from "@/components/versioninformation.vue";

declare const VERSION: string;
declare const COMMITTIMESTAMP: number | undefined;

const component = defineComponent({
  name: 'App',
  el: '#app',
  data: function() {
    return {
      'aPrice': undefined as Decimal | undefined,
      'aShipping': undefined as Decimal | undefined,
      'ooaPrice': undefined as Decimal | undefined,
      'ooaShipping': undefined as Decimal | undefined,
      'version': VERSION,
      'commitTimestamp': typeof (COMMITTIMESTAMP) !== 'undefined' ? COMMITTIMESTAMP * 1e3 : undefined,
      'configurations': configurations,
      'configuration': configurations.DE_Prime
    }
  },
  methods: {
    resetAll(): void {
      this.aPrice      = undefined;
      this.aShipping   = undefined;
      this.ooaPrice    = undefined;
      this.ooaShipping = undefined;
    }
  },
  computed: {
    calculator(): AmazonBonusCalculator {
      return new AmazonBonusCalculator (this.configuration)
    },
    optimizationResult(): OptimizationResult {
      return this.calculator.optimize(this.ooaPrice, this.ooaShipping, this.aPrice, this.aShipping)
    }
  },
  components: {
    configurationselector, priceinput, resultmessage, resulttable, versioninformation
  }
});

export default component;
</script>

<style>
@import './assets/index.css';
</style>
