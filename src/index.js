import './index.css';

const cashback_amazon        = 0.03;
const cashback_out_of_amazon = 0.005;

const update_result_calculation = x => {
	const ooa_price    = Number (document.getElementById('ooa-price')   .value);
	const ooa_shipping = Number (document.getElementById('ooa-shipping').value);
	const a_price      = Number (document.getElementById('a-price')     .value);
	const a_shipping   = Number (document.getElementById('a-shipping')  .value);

	document.getElementById('result_calculation').textContent
		= `With quantity = ${x}:\r\nPrice out of Amazon: ${(ooa_price*x + ooa_shipping)*(1-cashback_out_of_amazon)} = ${x}*${ooa_price} + ${ooa_shipping} - ${cashback_out_of_amazon*100} % cashback\r\nPrice on Amazon: ${(a_price*x + a_shipping) * (1-cashback_amazon)} = ${x}*${a_price} + ${a_shipping} - ${cashback_amazon*100} % cashback`;
}

const update = () => {
	const ooa_price    = Number (document.getElementById('ooa-price')   .value);
	const ooa_shipping = Number (document.getElementById('ooa-shipping').value);
	const a_price      = Number (document.getElementById('a-price')     .value);
	const a_shipping   = Number (document.getElementById('a-shipping')  .value);

	// (ooa_price*x + ooa_shipping)*(1-cashback_out_of_amazon) = ((a_price*x + a_shipping) * (1-cashback_amazon))
	let x = (-cashback_amazon*a_shipping + ooa_shipping*(cashback_out_of_amazon - 1) + a_shipping)
		/ (a_price * (cashback_amazon - 1) - ooa_price*cashback_out_of_amazon + ooa_price);
	
	console.log(`x = ${x} -> ${(!isFinite (x) || x < 0) ?  0 : Math.ceil(x)}`);
	if (!isFinite (x) || x < 0)
		x = 0;
	else
		x = Math.ceil (x);

	document.getElementById('result').textContent = 
		x > 1 ? (
			(ooa_price*(x-x/10) + ooa_shipping)*(1-cashback_out_of_amazon) < ((a_price*(x-x/10) + a_shipping) * (1-cashback_amazon))
			? `It makes sense to buy on Amazon when quantity >= ${Math.ceil(x)}`
			: `It makes sense to buy out of Amazon when quantity >= ${Math.ceil(x)}`
		)
		: (
			(ooa_price*(x-x/10) + ooa_shipping)*(1-cashback_out_of_amazon) < ((a_price*(x-x/10) + a_shipping) * (1-cashback_amazon))
			? `With these parameters, it always makes sense to buy outside of Amazon.`
			: `With these parameters, it always makes sense to buy on Amazon.`
		);
	
	update_result_calculation (x > 1 ? x : 1);
};

document.getElementById ('reset').addEventListener ('click', event => {
	event.preventDefault();
	Array.from (document.getElementsByTagName ('input'))
		.forEach (obj => obj.value = '')
});

document.getElementById('ooa-price')   .addEventListener ('input', update);
document.getElementById('ooa-shipping').addEventListener ('input', update);
document.getElementById('a-price')     .addEventListener ('input', update);
document.getElementById('a-shipping')  .addEventListener ('input', update);

window.onload = update;
