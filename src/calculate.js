const cashback_amazon         = 0.03;
const cashback_outside_amazon = 0.005;

const calculate_amazon =         (n, price, shipping) => (n*price + shipping) * (1 - cashback_amazon);

const calculate_outside_amazon = (n, price, shipping) => (n*price + shipping) * (1 - cashback_outside_amazon);

const intersect = (ooa_price, ooa_shipping, a_price, a_shipping) => {
    // calculate intersection:
    // (ooa_price*x + ooa_shipping)*(1-cashback_outside_amazon) = ((a_price*x + a_shipping) * (1-cashback_amazon))

    const x = (-cashback_amazon*a_shipping + ooa_shipping*(cashback_outside_amazon - 1) + a_shipping)
        / (a_price * (cashback_amazon - 1) - ooa_price*cashback_outside_amazon + ooa_price);

    return isFinite (x) ? x : undefined;
};

export {
    cashback_amazon, cashback_outside_amazon,
    calculate_amazon, calculate_outside_amazon, intersect
};