import { has_one_solution } from './has_one_solution.js'
import { Rng } from './rand.js'
import { deepCopy, Sudoku } from './sudoku.js'

/**
 * @typedef {number} Difficulty
 */

/**
 * @typedef {Object} DifficultyRange
 * @property {number} min
 * @property {number} max
 */

/** @type {Difficulty} */
export const EASY = 0
/** @type {Difficulty} */
export const MEDIUM = 1
/** @type {Difficulty} */
export const HARD = 2

/** @type {DifficultyRange[]} */
const ranges = [
    // Easy
    { min: 30, max: 40 },
    // Medium
    { min: 40, max: 50 },
    // Hard
    { min: 50, max: 60 },
]

/**
 * @typedef {Object} RemoveTrace
 * @property {Sudoku} sudoku
 * @property {number} grade
 */

/**
 * Removes cells so that the outputted Sudoku is solvable, with only one solution, and that it fits the given difficulty
 * @modifies {sudoku}
 * @param {Rng} rng
 * @param {Sudoku} sudoku
 * @param {} difficulty
 *
 */
export function removeCells(rng, sudoku, difficulty) {
    let range = ranges[difficulty]

    /** @type {RemoveTrace[]} */
    let trace = []

    let currentSudoku = deepCopy(sudoku)
    let currentGrade = 0

    while (true) {
        let remove_r = rng.nextRange(0, currentSudoku.size)
        let remove_c = rng.nextRange(0, currentSudoku.size)

        if (currentSudoku.grid[remove_r][remove_c].num == null) continue

        trace.push({
            sudoku: deepCopy(currentSudoku),
            grade: currentGrade,
        })

        currentSudoku.grid[remove_r][remove_c].num = null
        currentSudoku.grid[remove_r][remove_c].is_hint = false
        currentGrade += 1

        if (!has_one_solution(currentSudoku) || currentGrade > range.max) {
            if (trace.length == 0)
                throw new Error('Failed to remove cells to make valid Sudoku')

            let t = trace.pop()
            currentSudoku = t.sudoku
            currentGrade = t.grade
            continue
        }

        if (currentGrade >= range.min && currentGrade < range.max) {
            break
        }
    }

    sudoku.grid = currentSudoku.grid
}
