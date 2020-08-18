import Decimal from "decimal.js";

const cashback_amazon_points = 3; // <- how many points...
const cashback_amazon_per    = 1; // <- ... per this amount

const cashback_outside_amazon_points = 1; // <- how many points...
const cashback_outside_amazon_per    = 2; // <- ... per this amount

const cashback_amazon = new Decimal(cashback_amazon_points).dividedBy(cashback_amazon_per).dividedBy(100);
const cashback_outside_amazon = new Decimal(cashback_outside_amazon_points).dividedBy(cashback_outside_amazon_per).dividedBy(100);

enum OrderPlace {
    Amazon = "Amazon",
    OutsideAmazon = "Outside Amazon"
}

class OptimizationResult {
    orderPlace?: OrderPlace;
    threshold: number;

    constructor(orderPlace?:OrderPlace, threshold = 1) {
        this.orderPlace = orderPlace;
        this.threshold = threshold;
    }
}

const normalized_eligible_amazon_factor         = (n:Decimal) => n.dividedBy(cashback_amazon_per).floor();
const normalized_eligible_outside_amazon_factor = (n:Decimal) => n.dividedBy(cashback_outside_amazon_per).floor();

const calculate_amazon_points =         (n:number, price:Decimal, shipping:Decimal = new Decimal(0)):Decimal => normalized_eligible_amazon_factor        (price.mul(n).plus(shipping)).mul(cashback_amazon_points);
const calculate_outside_amazon_points = (n:number, price:Decimal, shipping:Decimal = new Decimal(0)):Decimal => normalized_eligible_outside_amazon_factor(price.mul(n).plus(shipping)).mul(cashback_outside_amazon_points);

const calculate_amazon =         (n:number, price:Decimal, shipping:Decimal = new Decimal(0)):Decimal => price.mul(n).plus(shipping).minus(calculate_amazon_points        (n, price, shipping).div(100));
const calculate_outside_amazon = (n:number, price:Decimal, shipping:Decimal = new Decimal(0)):Decimal => price.mul(n).plus(shipping).minus(calculate_outside_amazon_points(n, price, shipping).div(100));

const intersect = (ooa_price:Decimal, ooa_shipping:Decimal, a_price:Decimal, a_shipping:Decimal):number|undefined => {
    // calculate intersection:
    // (ooa_price*x + ooa_shipping)*(1-cashback_outside_amazon) = ((a_price*x + a_shipping) * (1-cashback_amazon))

    const x = cashback_amazon.negated().mul(a_shipping) .plus( ooa_shipping.mul( cashback_outside_amazon.minus(1) ) ) .plus (a_shipping)
        .dividedBy( a_price.mul(cashback_amazon.minus(1)) .minus( ooa_price.mul(cashback_outside_amazon) ) .plus(ooa_price) );

    return x.isFinite() ? x.toNumber() : undefined;
};

const optimize = (ooa_price:Decimal, ooa_shipping:Decimal, a_price:Decimal, a_shipping:Decimal):OptimizationResult => {
    const x = intersect (ooa_price, ooa_shipping, a_price, a_shipping) || 0;
    const X = Math.ceil(x);

    // console.log(`x = ${x} -> X = ${X}`);

    if (x > 0) { // > 0: depends on x
        for (let offset = 10; offset >= -10; --offset) {
            const ooa1 = calculate_outside_amazon(X+offset-1, ooa_price, ooa_shipping),
                a1 = calculate_amazon(X+offset-1, a_price, a_shipping);
            const ooa2 = calculate_outside_amazon(X+offset, ooa_price, ooa_shipping),
                a2 = calculate_amazon(X+offset, a_price, a_shipping);

            // console.log("check",ooa1,ooa1.comparedTo(a1),a1,"??",ooa2,ooa2.comparedTo(a2), a2);
            if ((ooa1.greaterThanOrEqualTo(a1)) && (ooa2.lessThan(a2)) || (ooa1.lessThan(a1)) && (ooa2.greaterThanOrEqualTo(a2))) {
                return (ooa2.lessThan(a2))
                    ? new OptimizationResult(OrderPlace.OutsideAmazon, X+offset)
                    : new OptimizationResult(OrderPlace.Amazon, X+offset)
            }
        }

        return new OptimizationResult(undefined, X);
    } else { // <= 0: does not depend on x; valid from x=0 on -> we can simply check at x = 1
        return calculate_outside_amazon(1, ooa_price, ooa_shipping).lessThan(calculate_amazon(1, a_price, a_shipping))
            ? new OptimizationResult(OrderPlace.OutsideAmazon)
            : new OptimizationResult(OrderPlace.Amazon)
    };
}

export {
    calculate_amazon_points, calculate_outside_amazon_points,
    cashback_amazon, cashback_outside_amazon,
    calculate_amazon, calculate_outside_amazon,
    OrderPlace, intersect, optimize
};