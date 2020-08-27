import Decimal from "decimal.js";

type AmazonBonusConfiguration = {
    name: string;
    Amazon: number;
    Outside: number;
}

/* eslint-disable @typescript-eslint/camelcase */

const DE_Prime: AmazonBonusConfiguration = {
    name: 'Germany (Prime)',
    Amazon: 3,
    Outside: 1
};

const DE_NonPrime: AmazonBonusConfiguration = {
    name: 'Germany (Non-Prime)',
    Amazon: 2,
    Outside: 1
};

/* eslint-enable @typescript-eslint/camelcase */

enum OrderPlace {
    Amazon = "Amazon",
    Outside = "Outside Amazon"
}

class OptimizationResult {
    orderPlace?: OrderPlace;
    threshold: number;

    constructor(orderPlace?: OrderPlace, threshold = 1) {
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

    readonly normalized_eligible_amazon_factor = (n: Decimal) => n.dividedBy(this.AmazonEligiblePer).floor();
    readonly normalized_eligible_outside_amazon_factor = (n: Decimal) => n.dividedBy(this.OutsideEligiblePer).floor();

    readonly calculateAmazonPoints =         (n: number, price: Decimal = new Decimal(0), shipping: Decimal = new Decimal(0)): Decimal =>
        this.normalized_eligible_amazon_factor        (price.mul(n).plus(shipping)).mul(this.configuration.Amazon);
    readonly calculateOutsideAmazonPoints = (n: number, price: Decimal = new Decimal(0), shipping: Decimal = new Decimal(0)): Decimal =>
        this.normalized_eligible_outside_amazon_factor(price.mul(n).plus(shipping)).mul(this.configuration.Outside);

    readonly calculate_amazon =         (n: number, price: Decimal = new Decimal(0), shipping: Decimal = new Decimal(0)): Decimal =>
        price.mul(n).plus(shipping).minus(this.calculateAmazonPoints        (n, price, shipping).div(100));
    readonly calculate_outside_amazon = (n: number, price: Decimal = new Decimal(0), shipping: Decimal = new Decimal(0)): Decimal =>
        price.mul(n).plus(shipping).minus(this.calculateOutsideAmazonPoints(n, price, shipping).div(100));

    readonly intersect = (ooaPrice: Decimal, ooaShipping: Decimal, aPrice: Decimal, aShipping: Decimal): number|undefined => {
        // calculate intersection:
        // (ooaPrice*x + ooaShipping)*(1-cashback_outside_amazon) = ((aPrice*x + aShipping) * (1-cashback_amazon))

        const x = this.AmazonCashbackPercentage.negated().mul(aShipping) .plus( ooaShipping.mul( this.OutsideCashbackPercentage.minus(1) ) ) .plus (aShipping)
            .dividedBy( aPrice.mul(this.AmazonCashbackPercentage.minus(1)) .minus( ooaPrice.mul(this.OutsideCashbackPercentage) ) .plus(ooaPrice) );

        return x.isFinite() ? x.toNumber() : undefined;
    };

    readonly optimize = (ooaPrice: Decimal = new Decimal(0), ooaShipping: Decimal = new Decimal(0), aPrice: Decimal = new Decimal(0), aShipping: Decimal = new Decimal(0)): OptimizationResult => {
        const x = this.intersect (ooaPrice, ooaShipping, aPrice, aShipping) || 0;
        const X = Math.ceil(x);

        // console.log(`x = ${x} -> X = ${X}`);

        if (x > 0) { // > 0: depends on x
            for (let offset = 10; offset >= -10; --offset) {
                const ooa1 = this.calculate_outside_amazon(X+offset-1, ooaPrice, ooaShipping),
                    a1 = this.calculate_amazon(X+offset-1, aPrice, aShipping);
                const ooa2 = this.calculate_outside_amazon(X+offset, ooaPrice, ooaShipping),
                    a2 = this.calculate_amazon(X+offset, aPrice, aShipping);

                // console.log("check",ooa1,ooa1.comparedTo(a1),a1,"??",ooa2,ooa2.comparedTo(a2), a2);
                if ((ooa1.greaterThanOrEqualTo(a1)) && (ooa2.lessThan(a2)) || (ooa1.lessThan(a1)) && (ooa2.greaterThanOrEqualTo(a2))) {
                    return (ooa2.lessThan(a2))
                        ? new OptimizationResult(OrderPlace.Outside, X+offset)
                        : new OptimizationResult(OrderPlace.Amazon, X+offset)
                }
            }

            return new OptimizationResult(undefined, X);
        } else { // <= 0: does not depend on x; valid from x=0 on -> we can simply check at x = 1
            return this.calculate_outside_amazon(1, ooaPrice, ooaShipping).lessThan(this.calculate_amazon(1, aPrice, aShipping))
                ? new OptimizationResult(OrderPlace.Outside)
                : new OptimizationResult(OrderPlace.Amazon)
        }
    }
}

/* eslint-disable @typescript-eslint/camelcase */
const configurations = {
    DE_Prime, DE_NonPrime
}
/* eslint-enable @typescript-eslint/camelcase */

export {
    configurations, OptimizationResult, AmazonBonusConfiguration, AmazonBonusCalculator, OrderPlace
};