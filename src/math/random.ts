/**
 * Returns a random boolean.
 *
 * @param chance The chance of the boolean being true. Defaults to 0.5 (equal).
 */
export function randomBoolean(chance = 0.5): boolean {
    return Math.random() < chance;
}

/**
 * Returns a random integer between min and max, inclusive.
 * Equivalent to `randomElement(range(min, max + 1))`.
 *
 * @param min The minimum value.
 * @param max The maximum value.
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Returns a random float between min and max, inclusive.
 *
 * @param min The minimum value.
 * @param max The maximum value.
 */
export function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random element from an array.
 * Equivalent to `array[randomInt(0, array.length - 1)]`.
 *
 * @param array The array to get a random element from.
 */
export function randomElement<T>(array: T[]): T {
    return array[randomInt(0, array.length - 1)];
}

/**
 * Returns the sum of all elements in an array.
 *
 * @param array The array to sum.
 */
export function sum(array: number[]): number {
    return array.reduce((a, b) => a + b);
}

/**
 * Returns a random element from an array, with a weight for each element.
 * The weights must be positive numbers and do not need to add up to 1.
 *
 * @param array The array to get a random element from.
 * @param weights The weights for each element.
 */
export function randomElementWeighted<T>(array: T[], weights: number[]): T {
    const totalWeight = sum(weights);
    const random = randomFloat(0, totalWeight);
    let currentWeight = 0;
    for (let i = 0; i < array.length; i++) {
        currentWeight += weights[i];
        if (random <= currentWeight) {
            return array[i];
        }
    }
    return array[array.length - 1];
}
