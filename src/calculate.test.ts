import {
    calculate_outside_amazon_points, calculate_outside_amazon,
    calculate_amazon_points, calculate_amazon,
} from './calculate';

describe("outside amazon points", () => {
    test('1x 5.55 + 0 give 2 points', () => {
        expect(calculate_outside_amazon_points(1, 5.55)).toBe(2);
    });

    test('0x 10.25 + 5.55 give 2 points', () => {
        expect(calculate_outside_amazon_points(0, 10.25, 5.55)).toBe(2);
    });

    test('5x 1.00 + 0.55 give 2 points', () => {
        expect(calculate_outside_amazon_points(5, 1, 0.55)).toBe(2);
    });

    test('1x 164.49 + 0 give 82 points', () => {
        expect(calculate_outside_amazon_points(1, 164.49)).toBe(82);
    });
});

describe("outside amazon grand total", () => {
    test('(1x 164.49 + 0) - cashback = 164.49 - 0.82', () => {
        expect(calculate_outside_amazon(1, 164.49, 0)).toBe(164.49 - 0.82);
    });
});

describe("amazon points", () => {
    test('1x 15.41 + 0 give 45 points', () => {
        expect(calculate_amazon_points(1, 15.41)).toBe(45);
    });

    test('0x 9.95 + 15.41 give 45 points', () => {
        expect(calculate_amazon_points(0, 9.95, 15.41)).toBe(45);
    });

    test('30x 0.50 + 0.41 give 45 points', () => {
        expect(calculate_amazon_points(30, 0.50, 0.41)).toBe(45);
    });

    test('1x 185 + 0.50 give (370+185) points', () => {
        expect(calculate_amazon_points(1, 185, 0.50)).toBe(370+185);
    });
});

describe("amazon grand total", () => {
    test('(1x 185 + 0.50) - cashback = 185.50 - 5.55', () => {
        expect(calculate_amazon(1, 185, 0.50)).toBe(185.50 - 5.55);
    });
});