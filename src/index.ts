import './index.css';
import { calculate_amazon, calculate_outside_amazon, OptimizationResult, optimize } from './calculate';
import {Decimal} from 'decimal.js';
import Vue from "vue";
import priceinput         from "./components/priceinput.vue";
import resultmessage      from "./components/resultmessage.vue";
import resulttable        from "./components/resulttable.vue";
import versioninformation from "./components/versioninformation.vue";

// @ts-ignore
window.calculate_amazon = calculate_amazon;
// @ts-ignore
window.calculate_outside_amazon = calculate_outside_amazon;

declare const VERSION: string;
declare const COMMITTIMESTAMP: number;

new Vue({
	el: '#app',
	data: {
		'aPrice':           undefined as Decimal|undefined,
		'aShipping':        undefined as Decimal|undefined,
		'ooaPrice':         undefined as Decimal|undefined,
		'ooaShipping':      undefined as Decimal|undefined,
		'version'    :      VERSION,
		'commitTimestamp' : COMMITTIMESTAMP * 1e3
	},
	methods: {
		resetAll():void {
			this.aPrice      = undefined;
			this.aShipping   = undefined;
			this.ooaPrice    = undefined;
			this.ooaShipping = undefined;
		}
	},
	computed: {
		optimizationResult: {
			get() :OptimizationResult {
				return optimize(this.ooaPrice, this.ooaShipping, this.aPrice, this.aShipping)
			}
		}
	},
	components: {
		priceinput, resultmessage, resulttable, versioninformation
	}
})

