const cashback_amazon         = 0.03;
const cashback_outside_amazon = 0.005;

const calculate_amazon_points =         (n:number, price:number, shipping:number = 0):number => Math.floor(Math.floor(n*price + shipping) * 100 * cashback_amazon);
const calculate_outside_amazon_points = (n:number, price:number, shipping:number = 0):number => Math.floor(Math.floor(n*price + shipping) * 100 * cashback_outside_amazon);

const calculate_amazon =         (n:number, price:number, shipping:number = 0):number => (n*price + shipping) - calculate_amazon_points        (n, price, shipping)/100;
const calculate_outside_amazon = (n:number, price:number, shipping:number = 0):number => (n*price + shipping) - calculate_outside_amazon_points(n, price, shipping)/100;

const intersect = (ooa_price:number, ooa_shipping:number, a_price:number, a_shipping:number):number|undefined => {
    // calculate intersection:
    // (ooa_price*x + ooa_shipping)*(1-cashback_outside_amazon) = ((a_price*x + a_shipping) * (1-cashback_amazon))

    const x = (-cashback_amazon*a_shipping + ooa_shipping*(cashback_outside_amazon - 1) + a_shipping)
        / (a_price * (cashback_amazon - 1) - ooa_price*cashback_outside_amazon + ooa_price);

    return isFinite (x) ? x : undefined;
};

export {
    calculate_amazon_points, calculate_outside_amazon_points,
    cashback_amazon, cashback_outside_amazon,
    calculate_amazon, calculate_outside_amazon, intersect
};