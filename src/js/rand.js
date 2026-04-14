// Source - https://stackoverflow.com/a/424445
// Posted by orip, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-06, License - CC BY-SA 4.0

/**
 * A seedable random number generator
 * @class
 * @property {number} seed - The original seed
 */
export class Rng {
    /**
     * Constructs a new random number generator using a seed
     * @constructor
     * @param {number | null} seed - The seed to use
     */
    constructor(seed) {
        // LCG using GCC's constants
        /** @private */
        this.m = 0x80000000 // 2**31;
        /** @private */
        this.a = 1103515245
        /** @private */
        this.c = 12345

        /** @private */
        this.state = seed ? seed : newSeed()

        /** @readonly */
        this.seed = this.state
    }

    /**
     * Returns a random 32 bit integer
     * @modifies {this}
     * @returns {number} A random integer
     */
    nextInt() {
        this.state = (this.a * this.state + this.c) % this.m
        return this.state
    }

    /**
     * Returns a random float in the range [0,1]
     * @modifies {this}
     * @returns {number} A random float in range [0,1]
     */
    nextFloat() {
        return this.nextInt() / (this.m - 1)
    }

    /**
     * Returns a random integer in the range [start, end), excluding end
     * @modifies {this}
     * @param {number} start
     * @param {number} end
     * @returns {number} A random integer in the range [start, end)
     */
    nextRange(start, end) {
        // can't modulu nextInt because of weak randomness in lower bits
        var rangeSize = end - start
        var randomUnder1 = this.nextInt() / this.m
        return start + Math.floor(randomUnder1 * rangeSize)
    }

    /**
     * Returns a random element from an array
     * @modifies {this}
     * @param {any[]} array
     * @returns {any} - The chosen element
     */
    choice(array) {
        return array[this.nextRange(0, array.length)]
    }
}

/**
 * Generate a new random seed
 * @returns {number} A ned random seed
 */
export function newSeed() {
    return Math.floor(Math.random() * (0x80000000 - 1))
}
