import './index.css';
import {Decimal} from 'decimal.js';
import Vue from "vue";
import priceinput         from "./components/priceinput.vue";
import resultmessage      from "./components/resultmessage.vue";
import resulttable        from "./components/resulttable.vue";
import versioninformation from "./components/versioninformation.vue";
import configurationselector from "./components/configurationselector.vue";
import {AmazonBonusCalculator, configurations, OptimizationResult} from "./calculate";

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
		'commitTimestamp' : COMMITTIMESTAMP * 1e3,
		'configurations':   configurations,
		'configuration':    configurations.DE_Prime
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
		calculator: {
			get():AmazonBonusCalculator {
				return new AmazonBonusCalculator (this.configuration)
			}
		},
		optimizationResult: {
			get():OptimizationResult {
				return this.calculator.optimize(this.ooaPrice, this.ooaShipping, this.aPrice, this.aShipping)
			}
		}
	},
	components: {
		configurationselector, priceinput, resultmessage, resulttable, versioninformation
	}
})

