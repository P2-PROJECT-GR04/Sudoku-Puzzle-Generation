import { find_candidates_for_cell } from './check-hint.js'
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
    { min: 40, max: 45 },
    // Medium
    { min: 45, max: 50 },
    // Hard
    { min: 50, max: 55 },
]

/**
 * @typedef {Object} RemoveTrace
 * @property {Sudoku} sudoku
 * @property {number} grade
 * @property {number} tries
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
    let currentTries = 0

    // currentGrade = removeStart(rng, currentSudoku, difficulty)

    while (true) {
        trace.push({
            sudoku: deepCopy(currentSudoku),
            grade: currentGrade,
            tries: currentTries,
        })

        let careful = currentTries > 10
        let count = removeIteration(rng, currentSudoku, difficulty, careful)
        currentGrade += count

        if (
            !has_one_solution(currentSudoku) ||
            currentGrade >= range.max ||
            count == 0
        ) {
            console.debug(`NO SOLUTION: BACKTRACKING (${currentTries})`)
            if (trace.length == 0)
                throw new Error('Failed to remove cells to make valid Sudoku')

            let t = trace.pop()

            t.tries += 1

            if (t.tries >= 20) {
                console.debug(`TRIED TOO MUCH: STARTING OVER`)
                if (trace.length == 0) {
                    currentSudoku = deepCopy(sudoku)
                    currentGrade = 0
                    currentTries = 0
                }
                t = trace.shift()
                trace = []
            }

            currentSudoku = t.sudoku
            currentGrade = t.grade
            currentTries = t.tries

            continue
        }

        if (currentGrade >= range.min && currentGrade < range.max) {
            break
        }
    }

    sudoku.grid = currentSudoku.grid
}

function removeIteration(rng, sudoku, difficulty, careful = false) {
    if (difficulty == EASY) {
        return removeEasy(rng, sudoku, careful)
    } else if (difficulty == MEDIUM) {
        return removeMedium(rng, sudoku, careful)
    } else if (difficulty == HARD) {
        return removeHard(rng, sudoku, careful)
    }
}

/**
 * @param {Rng} rng
 * @param {Sudoku} sudoku
 * @param {boolean} careful
 * @returns {number}
 */
function removeEasy(rng, sudoku, careful = false) {
    let count = 0
    let cellList = getCellList(sudoku)
    if (cellList.length == 0) throw new Error('No more valid cells')

    let cells = cellList.filter(
        (cell) => cell.candidates.length > 0 && cell.candidates.length <= 3
    )
    if (cells.length == 0) cells = cellList

    let cell = rng.choice(cells)

    sudoku.grid[cell.r][cell.c].num = null
    sudoku.grid[cell.r][cell.c].is_hint = false
    count += 1

    if (!careful) {
        const max = sudoku.size - 1
        sudoku.grid[max - cell.r][max - cell.c].num = null
        sudoku.grid[max - cell.r][max - cell.c].is_hint = false
        count += 1
    }

    return count
}

/**
 * @param {Rng} rng
 * @param {Sudoku} sudoku
 */
function removeMedium(rng, sudoku, careful = false) {
    let count = 0
    let cellList = getCellList(sudoku)
    if (cellList.length == 0) throw new Error('No more valid cells')

    let cells = cellList.filter(
        (cell) => cell.candidates.length >= 3 && cell.candidates.length <= 6
    )
    if (cells.length == 0) cells = cellList

    let cell = rng.choice(cells)

    sudoku.grid[cell.r][cell.c].num = null
    sudoku.grid[cell.r][cell.c].is_hint = false
    count += 1

    if (!careful) {
        const max = sudoku.size - 1
        sudoku.grid[max - cell.r][max - cell.c].num = null
        sudoku.grid[max - cell.r][max - cell.c].is_hint = false
        count += 1
    }

    return count
}

/**
 * @param {Rng} rng
 * @param {Sudoku} sudoku
 */
function removeHard(rng, sudoku, careful = false) {
    let count = 0
    let cellList = getCellList(sudoku)
    if (cellList.length == 0) throw new Error('No more valid cells')

    let cells = cellList.filter(
        (cell) => cell.candidates.length >= 5 && cell.candidates.length <= 9
    )
    if (cells.length == 0) cells = cellList

    let cell = rng.choice(cells)

    sudoku.grid[cell.r][cell.c].num = null
    sudoku.grid[cell.r][cell.c].is_hint = false
    count += 1

    if (!careful) {
        const max = sudoku.size - 1
        sudoku.grid[max - cell.r][max - cell.c].num = null
        sudoku.grid[max - cell.r][max - cell.c].is_hint = false
        count += 1
    }

    return count
}

/**
 * @param {Sudoku} sudoku
 * @param {number} start
 * @param {number} start
 * @returns {{r: number, c: number, candidates: number[]}[]}
 */
function getCellList(sudoku) {
    let list = []
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            let num = sudoku.grid[r][c].num
            let candidates = sudoku.grid[r][c].candidates

            if (num == null) continue

            sudoku.grid[r][c].num = null
            find_candidates_for_cell(sudoku, r, c)

            list.push({
                r: r,
                c: c,
                candidates: [...sudoku.grid[r][c].candidates],
            })

            sudoku.grid[r][c].num = num
            sudoku.grid[r][c].candidates = candidates
        }
    }

    return list.sort((a, b) => a.candidates.length <= b.candidates.length)
}
