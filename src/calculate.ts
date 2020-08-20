import Decimal from "decimal.js";

type AmazonBonusConfiguration = {
    name: string,
    Amazon: number,
    Outside: number
}

const DE_Prime:AmazonBonusConfiguration = {
    name: 'Germany (Prime)',
    Amazon: 3,
    Outside: 1
};

const DE_NonPrime:AmazonBonusConfiguration = {
    name: 'Germany (Non-Prime)',
    Amazon: 2,
    Outside: 1
};

enum OrderPlace {
    Amazon = "Amazon",
    Outside = "Outside Amazon"
}

class OptimizationResult {
    orderPlace?: OrderPlace;
    threshold: number;

    constructor(orderPlace?:OrderPlace, threshold = 1) {
        this.orderPlace = orderPlace;
        this.threshold = threshold;
    }
}

class AmazonBonusCalculator {
    configuration: AmazonBonusConfiguration;
    readonly AmazonEligiblePer  = 1;
    readonly OutsideEligiblePer = 2;
    AmazonCashbackPercentage: Decimal;
    OutsideCashbackPercentage: Decimal;

    constructor(configuration: AmazonBonusConfiguration) {
        this.configuration = configuration;
        this.AmazonCashbackPercentage = new Decimal(this.configuration.Amazon).dividedBy(this.AmazonEligiblePer).dividedBy(100);
        this.OutsideCashbackPercentage = new Decimal(this.configuration.Outside).dividedBy(this.OutsideEligiblePer).dividedBy(100);
    }

    readonly normalized_eligible_amazon_factor = (n:Decimal) => n.dividedBy(this.AmazonEligiblePer).floor();
    readonly normalized_eligible_outside_amazon_factor = (n:Decimal) => n.dividedBy(this.OutsideEligiblePer).floor();

    readonly calculate_amazon_points =         (n:number, price:Decimal = new Decimal(0), shipping:Decimal = new Decimal(0)):Decimal =>
        this.normalized_eligible_amazon_factor        (price.mul(n).plus(shipping)).mul(this.configuration.Amazon);
    readonly calculate_outside_amazon_points = (n:number, price:Decimal = new Decimal(0), shipping:Decimal = new Decimal(0)):Decimal =>
        this.normalized_eligible_outside_amazon_factor(price.mul(n).plus(shipping)).mul(this.configuration.Outside);

    readonly calculate_amazon =         (n:number, price:Decimal = new Decimal(0), shipping:Decimal = new Decimal(0)):Decimal =>
        price.mul(n).plus(shipping).minus(this.calculate_amazon_points        (n, price, shipping).div(100));
    readonly calculate_outside_amazon = (n:number, price:Decimal = new Decimal(0), shipping:Decimal = new Decimal(0)):Decimal =>
        price.mul(n).plus(shipping).minus(this.calculate_outside_amazon_points(n, price, shipping).div(100));

    readonly intersect = (ooa_price:Decimal, ooa_shipping:Decimal, a_price:Decimal, a_shipping:Decimal):number|undefined => {
        // calculate intersection:
        // (ooa_price*x + ooa_shipping)*(1-cashback_outside_amazon) = ((a_price*x + a_shipping) * (1-cashback_amazon))

        const x = this.AmazonCashbackPercentage.negated().mul(a_shipping) .plus( ooa_shipping.mul( this.OutsideCashbackPercentage.minus(1) ) ) .plus (a_shipping)
            .dividedBy( a_price.mul(this.AmazonCashbackPercentage.minus(1)) .minus( ooa_price.mul(this.OutsideCashbackPercentage) ) .plus(ooa_price) );

        return x.isFinite() ? x.toNumber() : undefined;
    };

    readonly optimize = (ooa_price:Decimal = new Decimal(0), ooa_shipping:Decimal = new Decimal(0), a_price:Decimal = new Decimal(0), a_shipping:Decimal = new Decimal(0)):OptimizationResult => {
        const x = this.intersect (ooa_price, ooa_shipping, a_price, a_shipping) || 0;
        const X = Math.ceil(x);

        // console.log(`x = ${x} -> X = ${X}`);

        if (x > 0) { // > 0: depends on x
            for (let offset = 10; offset >= -10; --offset) {
                const ooa1 = this.calculate_outside_amazon(X+offset-1, ooa_price, ooa_shipping),
                    a1 = this.calculate_amazon(X+offset-1, a_price, a_shipping);
                const ooa2 = this.calculate_outside_amazon(X+offset, ooa_price, ooa_shipping),
                    a2 = this.calculate_amazon(X+offset, a_price, a_shipping);

                // console.log("check",ooa1,ooa1.comparedTo(a1),a1,"??",ooa2,ooa2.comparedTo(a2), a2);
                if ((ooa1.greaterThanOrEqualTo(a1)) && (ooa2.lessThan(a2)) || (ooa1.lessThan(a1)) && (ooa2.greaterThanOrEqualTo(a2))) {
                    return (ooa2.lessThan(a2))
                        ? new OptimizationResult(OrderPlace.Outside, X+offset)
                        : new OptimizationResult(OrderPlace.Amazon, X+offset)
                }
            }

            return new OptimizationResult(undefined, X);
        } else { // <= 0: does not depend on x; valid from x=0 on -> we can simply check at x = 1
            return this.calculate_outside_amazon(1, ooa_price, ooa_shipping).lessThan(this.calculate_amazon(1, a_price, a_shipping))
                ? new OptimizationResult(OrderPlace.Outside)
                : new OptimizationResult(OrderPlace.Amazon)
        };
    }
}

const configurations = {
    DE_Prime, DE_NonPrime
}

export {
    configurations, OptimizationResult, AmazonBonusConfiguration, AmazonBonusCalculator, OrderPlace
};