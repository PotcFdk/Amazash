import {
    AmazonBonusCalculator, configurations,
    OrderPlace,
} from '@/calculate';
import Decimal from "decimal.js";

const D = (n: number) => new Decimal(n);

const instance = new AmazonBonusCalculator(configurations.DE_Prime);

expect.extend({
    toBeDecimal(received: Decimal, expected: Decimal) {
        return {
            pass: received.equals(expected),
            message: () => `expected ${received} to equal ${expected}`
        };
    },
    decimalToBe(received: Decimal, expected: number) {
        return {
            pass: received.equals(expected),
            message: () => `expected ${received} to equal ${expected}`
        };
    }
})

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeDecimal(expected: Decimal): CustomMatcherResult;
            decimalToBe(expected: number): CustomMatcherResult;
        }
    }
}
/* eslint-enable @typescript-eslint/no-namespace */

describe("outside amazon points", () => {
    test('1x 5.55 + 0 give 2 points', () => {
        expect(instance.calculateOutsideAmazonPoints(1, D(5.55))).decimalToBe(2);
    });

    test('0x 10.25 + 5.55 give 2 points', () => {
        expect(instance.calculateOutsideAmazonPoints(0, D(10.25), D(5.55))).decimalToBe(2);
    });

    test('5x 1 + 0.55 give 2 points', () => {
        expect(instance.calculateOutsideAmazonPoints(5, D(1), D(.55))).decimalToBe(2);
    });

    test('1x 164.49 + 0 give 82 points', () => {
        expect(instance.calculateOutsideAmazonPoints(1, D(164.49))).decimalToBe(82);
    });
});

describe("outside amazon grand total", () => {
    test('(1x 164.49 + 0) - cashback = 164.49 - 0.82', () => {
        expect(instance.calculate_outside_amazon(1, D(164.49), D(0))).toBeDecimal(D(164.49).minus(.82));
    });
});

describe("amazon points", () => {
    test('1x 15.41 + 0 give 45 points', () => {
        expect(instance.calculateAmazonPoints(1, D(15.41))).decimalToBe(45);
    });

    test('0x 9.95 + 15.41 give 45 points', () => {
        expect(instance.calculateAmazonPoints(0, D(9.95), D(15.41))).decimalToBe(45);
    });

    test('30x 0.50 + 0.41 give 45 points', () => {
        expect(instance.calculateAmazonPoints(30, D(.5), D(.41))).decimalToBe(45);
    });

    test('1x 185.00 + 0.50 give (3.70+1.85) points', () => {
        expect(instance.calculateAmazonPoints(1, D(185), D(.5))).decimalToBe(370+185);
    });
});

describe("amazon grand total", () => {
    test('(1x 185.00 + 0.50) - cashback = 185.50 - 5.55', () => {
        expect(instance.calculate_amazon(1, D(185), D(.5))).toBeDecimal(D(185.50).minus(3.70).minus(1.85));
    });
});

const checkThresholdForValidity = (intersection: number, ooaPrice: Decimal, ooaShipping: Decimal, aPrice: Decimal, aShipping: Decimal) => {
    expect(intersection).toBe(Math.floor(intersection)); // expect an integer

    if (intersection > 1) { // depends on n
        // check at intersection point, is outside lower?
        if (instance.calculate_outside_amazon(intersection, ooaPrice, ooaShipping).lessThan(instance.calculate_amazon(intersection, aPrice, aShipping))) {
            // yes, outside is lower, so we're expecting that with growing n it will stay that way:
            for (let step = 1; step < 10; ++step)
                expect(instance.calculate_outside_amazon(intersection+step, ooaPrice, ooaShipping).toNumber()).toBeLessThan(instance.calculate_amazon(intersection+step, aPrice, aShipping).toNumber());
        } else {
            // outside is not lower -> we're expecting that with growing n it will stay that way:
            for (let step = 1; step < 10; ++step)
                expect(instance.calculate_outside_amazon(intersection + step, ooaPrice, ooaShipping).toNumber()).toBeGreaterThanOrEqual(instance.calculate_amazon(intersection + step, aPrice, aShipping).toNumber());
        }
    } else { // does not depend on n
        // beginning at n=1 we're have one of two cases:
        if (instance.calculate_outside_amazon(1, ooaPrice, ooaShipping).lessThan(instance.calculate_amazon(1, aPrice, aShipping))) {
            // outside is lower, and it should stay like that:
            for (let step = 2; step < 10; ++step)
                expect(instance.calculate_outside_amazon(step, ooaPrice, ooaShipping).toNumber()).toBeLessThan(instance.calculate_amazon(step, aPrice, aShipping).toNumber());
        } else {
            // outside is higher, and it should stay like that:
            for (let step = 2; step < 10; ++step)
                expect(instance.calculate_outside_amazon(step, ooaPrice, ooaShipping).toNumber()).toBeGreaterThan(instance.calculate_amazon(step, aPrice, aShipping).toNumber());
        }
    }
};

const checkIntersectionForValidity = (intersection: number, ooaPrice: Decimal, ooaShipping: Decimal, aPrice: Decimal, aShipping: Decimal) =>
    checkThresholdForValidity(intersection + 1, ooaPrice, ooaShipping, aPrice, aShipping);

const intersectTestCase = (ooaPrice: Decimal, ooaShipping: Decimal, aPrice: Decimal, aShipping: Decimal) =>
    test(`n*${ooaPrice}+${ooaShipping} vs. n*${aPrice}+${aShipping}`, () => {
        const intersection = Math.ceil(instance.intersect(ooaPrice, ooaShipping, aPrice, aShipping) || 0);
        checkIntersectionForValidity(intersection, ooaPrice, ooaShipping, aPrice, aShipping);
    });

describe("intersection", () => {
    intersectTestCase(D(68.74), D( 0.48), D(39.06), D(95.06));
    intersectTestCase(D(31.61), D(28.15), D(16.58), D(60.56));
});

describe("mass_optimization", () => {
    for (let i = 0; i < 1e4; ++i) {
        const
            ooaPrice    = new Decimal(Math.random()).mul(1e2).toDecimalPlaces(2),
            ooaShipping = new Decimal(Math.random()).mul(1e2).toDecimalPlaces(2),
            aPrice      = new Decimal(Math.random()).mul(1e2).toDecimalPlaces(2),
            aShipping   = new Decimal(Math.random()).mul(1e2).toDecimalPlaces(2);

        test(`n*${ooaPrice}+${ooaShipping} vs. n*${aPrice}+${aShipping}`, () => {
            const optimal = instance.optimize(ooaPrice, ooaShipping, aPrice, aShipping);
            checkThresholdForValidity(optimal.threshold, ooaPrice, ooaShipping, aPrice, aShipping);
            if (instance.calculate_outside_amazon(optimal.threshold, ooaPrice, ooaShipping).lessThan(instance.calculate_amazon(optimal.threshold, aPrice, aShipping)))
                expect(optimal.orderPlace).toBe(OrderPlace.Outside);
            else
                expect(optimal.orderPlace).toBe(OrderPlace.Amazon);
        });
    }
});

describe("optimization", () => {
   test('n*399+299 vs. n*399+399', () => {
       const optimal = instance.optimize(D(3.99), D(2.99), D(3.99), D(3.99));
       expect(optimal.orderPlace).toBe(OrderPlace.Amazon);
       expect(optimal.threshold).toBe(10);
   })
    test('n*1507+6260 vs. n*1587+2759', () => {
        const optimal = instance.optimize(D(15.07), D(62.60), D(15.87), D(27.59));
        expect(optimal.orderPlace).toBe(OrderPlace.Outside);
        expect(optimal.threshold).toBe(90);
    })
    test('n*7681+1625 vs. n*7878+3762', () => {
        const optimal = instance.optimize(D(76.81), D(16.25), D(78.78), D(37.62));
        expect(optimal.orderPlace).toBe(OrderPlace.Amazon);
        expect(optimal.threshold).toBe(2174);
        checkThresholdForValidity(optimal.threshold, D(76.81), D(16.25), D(78.78), D(37.62));
    })
});
