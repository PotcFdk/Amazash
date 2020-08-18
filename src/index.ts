import './index.css';
import {
	calculate_amazon, calculate_amazon_points,
	calculate_outside_amazon, calculate_outside_amazon_points,
	cashback_amazon,
	cashback_outside_amazon,
	optimize,
	OrderPlace
} from './calculate';
import {Decimal} from 'decimal.js';

// @ts-ignore
window.calculate_amazon = calculate_amazon;
// @ts-ignore
window.calculate_outside_amazon = calculate_outside_amazon;

const update_result_calculation = (ooa_price:Decimal, ooa_shipping:Decimal, a_price:Decimal, a_shipping:Decimal, x:number) => {
	const table = <HTMLTableElement> document.getElementById("result_calculation_body");
	table.innerHTML = '';

	[-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5]
		.map(offset => offset + 11-Math.max(Math.min(x, 10), 0))
		.map(offset => ({
			quantity: x+offset,
			ooa: calculate_outside_amazon(x+offset, ooa_price, ooa_shipping),
			//ooa_string: `(${x+offset}*${ooa_price} + ${ooa_shipping}) - ${cashback_outside_amazon * 100} % cashback`,
			a: calculate_amazon(x+offset, a_price, a_shipping),
			//a_string: `(${x+offset}*${a_price} + ${a_shipping}) - ${cashback_amazon * 100} % cashback`,
			color: !offset && 'red'
		})
		).forEach(item => {
			//console.log(item.a.toNumber());
			let row = table.insertRow();
			if (item.color) row.style.backgroundColor = item.color;
			let quantity = row.insertCell(0);
			quantity.innerText = item.quantity.toString();
			let ooa = row.insertCell(1);
			ooa.innerText = `${ooa_price.mul(x).plus(ooa_shipping)} - ${calculate_outside_amazon_points(x, ooa_price, ooa_shipping).div(100)} = ${item.ooa.toFixed(2)}`;
			let cmp = row.insertCell(2);
			cmp.innerText = item.ooa.greaterThan(item.a) ? '>' : item.ooa.lessThan(item.a) ? '<' : '=';
			let a = row.insertCell(3);
			a.innerText = `${a_price.mul(x).plus(a_shipping)} - ${calculate_amazon_points(x, a_price, a_shipping).div(100)} = ${item.a.toFixed(2)}`;
			let verdict = row.insertCell(4);
			verdict.innerText = item.ooa.greaterThanOrEqualTo(item.a) ? 'Amazon wins!' : 'Outside of Amazon wins!';
		});
};

const update = () => {
	const ooa_price    = new Decimal((<HTMLInputElement>document.getElementById('ooa-price'))   .value || 0);
	const ooa_shipping = new Decimal((<HTMLInputElement>document.getElementById('ooa-shipping')).value || 0);
	const a_price      = new Decimal((<HTMLInputElement>document.getElementById('a-price'))     .value || 0);
	const a_shipping   = new Decimal((<HTMLInputElement>document.getElementById('a-shipping'))  .value || 0);

	const optimal = optimize(ooa_price, ooa_shipping, a_price, a_shipping);

	document.getElementById('result')!.textContent =
            optimal.threshold > 1 ? ( // > 1: depends on x
                optimal.orderPlace == OrderPlace.OutsideAmazon
					? `It makes sense to buy outside Amazon when quantity >= ${optimal.threshold}`
					: `It makes sense to buy on Amazon when quantity >= ${optimal.threshold}`
            )
            : ( // <= 1: does not depend on x; valid from x=1 on (a.k.a. "always")
                optimal.orderPlace == OrderPlace.OutsideAmazon
					? `With these parameters, it always makes sense to buy outside of Amazon.`
					: `With these parameters, it always makes sense to buy on Amazon.`
            );

	update_result_calculation (ooa_price, ooa_shipping, a_price, a_shipping, optimal.threshold);
};

document.getElementById ('reset')!.addEventListener ('click', event => {
	event.preventDefault();
	Array.from (document.getElementsByTagName ('input'))
		.forEach (obj => obj.value = '')
});

document.getElementById('ooa-price')   !.addEventListener ('input', update);
document.getElementById('ooa-shipping')!.addEventListener ('input', update);
document.getElementById('a-price')     !.addEventListener ('input', update);
document.getElementById('a-shipping')  !.addEventListener ('input', update);

declare const VERSION: string;
declare const COMMITTIMESTAMP: number;

document.getElementById('version')!.textContent = `Version: ${VERSION} from ${new Date(COMMITTIMESTAMP * 1e3).toUTCString()}`;

window.onload = update;
