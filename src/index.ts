import './index.css';
import {
	cashback_amazon, cashback_outside_amazon,
	calculate_amazon, calculate_outside_amazon, intersect
} from './calculate';

const update_result_calculation = (ooa_price:number, ooa_shipping:number, a_price:number, a_shipping:number, x:number) =>
	document.getElementById('result_calculation')!.textContent
		= `With quantity = ${x}:\r\nPrice outside Amazon: ${calculate_outside_amazon(x, ooa_price, ooa_shipping).toFixed(2)} = (${x}*${ooa_price} + ${ooa_shipping}) - ${cashback_outside_amazon*100} % cashback\r\nPrice on Amazon: ${calculate_amazon(x, a_price, a_shipping).toFixed(2)} = (${x}*${a_price} + ${a_shipping}) - ${cashback_amazon*100} % cashback`;

const update = () => {
	const ooa_price    = Number ((<HTMLInputElement>document.getElementById('ooa-price'))   .value);
	const ooa_shipping = Number ((<HTMLInputElement>document.getElementById('ooa-shipping')).value);
	const a_price      = Number ((<HTMLInputElement>document.getElementById('a-price'))     .value);
	const a_shipping   = Number ((<HTMLInputElement>document.getElementById('a-shipping'))  .value);

	const x = intersect (ooa_price, ooa_shipping, a_price, a_shipping) || 0;
	const X = Math.ceil (x);

	document.getElementById('result')!.textContent =
            x > 1 ? ( // > 1: depends on x -> check at ceil(x)
                calculate_outside_amazon (X, ooa_price, ooa_shipping) < calculate_amazon (X, a_price, a_shipping)
                ? `It makes sense to buy outside Amazon when quantity >= ${X}`
                : `It makes sense to buy on Amazon when quantity >= ${X}`
            )
            : ( // <= 1: does not depend on x; valid from x=1 on -> we can simply check at x = 1
                calculate_outside_amazon (1, ooa_price, ooa_shipping) < calculate_amazon (1, a_price, a_shipping)
                ? `With these parameters, it always makes sense to buy outside of Amazon.`
                : `With these parameters, it always makes sense to buy on Amazon.`
            );

	update_result_calculation (ooa_price, ooa_shipping, a_price, a_shipping, Math.max (X, 1));
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
