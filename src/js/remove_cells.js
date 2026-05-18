import { find_candidates_for_cell } from './check-hint.js'
import { grade } from './difficulty_grader.js'
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
    { min: 2.0, max: 2.5 },
    // Medium
    { min: 2.5, max: 3.5 },
    // Hard
    { min: 3.0, max: 10.0 },
]

// A Minimal Sudoku needs to have between 39 and 20 hints [https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf]
const minimal_range = { min: 42, max: 61 }

/**
 * Removes cells so that the outputted Sudoku is solvable, with only one solution, and that it fits the given difficulty
 * @modifies {sudoku}
 * @param {Rng} rng
 * @param {Sudoku} sudoku
 * @param {number} difficulty
 */
export function removeCells(rng, sudoku, difficulty) {
    let range = ranges[difficulty]

    let currentSudoku = deepCopy(sudoku)
    let currentGrade = 0
    let currentTries = 0
    let currentRemoved = 0

    let prevEmpty = 0
    let unsolvable_counter = 0

    let iter = 0
    while (true) {
        iter += 1
        if (unsolvable_counter >= 40) {
            currentSudoku = deepCopy(sudoku)
            currentGrade = 0
            currentTries = 0
            currentRemoved = 0

            prevEmpty = 0
            unsolvable_counter = 0
        }

        const careful = Math.abs(currentRemoved - minimal_range.max) <= 10
        const count = removeIteration(rng, currentSudoku, difficulty, careful)
        currentRemoved += count

        console.log(`== (REMOVED: ${currentRemoved})`)
        let is_solvable = has_one_solution(currentSudoku)
        if (
            is_solvable &&
            currentRemoved >= minimal_range.min &&
            currentRemoved < minimal_range.max
        ) {
            currentGrade = grade(currentSudoku)
        }

        if (
            is_solvable ||
            (currentRemoved >= minimal_range.min &&
                currentRemoved < minimal_range.max)
        ) {
            if (!is_solvable)
                console.log(`# NOT SOLVABLE (${unsolvable_counter}); SKIPPING`)

            unsolvable_counter = 0
        } else {
            unsolvable_counter += 1
            console.log(`# NOT SOLVABLE (${unsolvable_counter}); SKIPPING`)
        }

        if (
            !is_solvable ||
            currentGrade >= range.max ||
            currentRemoved >= minimal_range.max ||
            count == 0
            // (currentGrade >= range.min &&
            //     currentGrade < range.max &&
            //     currentRemoved < minimal_range.min)
        ) {
            let emptyCells = getEmptyCellList(currentSudoku)
            if (prevEmpty == emptyCells.length) {
                currentTries += 1
            } else {
                currentTries = 0
                prevEmpty = emptyCells.length
            }

            // let times = currentTries > 2 ? 2 : 1
            //
            let times = 2
            if (emptyCells.length <= 5) times += 1

            for (let i = 0; i < times; i++) {
                let cells = emptyCells.filter((x) => x.candidates.length >= 7)
                if (cells.length == 0) cells = emptyCells

                let cell = rng.choice(cells)
                let r1 = cell.r
                let c1 = cell.c

                currentSudoku.grid[r1][c1].num =
                    currentSudoku.grid[r1][c1].solution
                currentSudoku.grid[r1][c1].is_hint = true

                currentRemoved -= 1

                const max = currentSudoku.size - 1

                let r2 = max - cell.r
                let c2 = max - cell.c

                emptyCells = emptyCells.filter(
                    (c) => (c.r != r1 || c.c != c1) && (c.r != r2 || c.c != c2)
                )

                if (currentSudoku.grid[r2][c2].num == null) {
                    currentSudoku.grid[r2][c2].num =
                        currentSudoku.grid[r2][c2].solution
                    currentSudoku.grid[r2][c2].is_hint = true
                    currentRemoved -= 1
                }
            }
            continue
        }

        if (
            currentGrade >= range.min &&
            currentGrade < range.max &&
            currentRemoved >= minimal_range.min
        ) {
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
    let cellList = getHintList(sudoku)
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
        if (sudoku.grid[max - cell.r][max - cell.c].num != null) {
            sudoku.grid[max - cell.r][max - cell.c].num = null
            sudoku.grid[max - cell.r][max - cell.c].is_hint = false
            count += 1
        }
    }

    return count
}

/**
 * @param {Rng} rng
 * @param {Sudoku} sudoku
 */
function removeMedium(rng, sudoku, careful = false) {
    let count = 0
    let cellList = getHintList(sudoku)
    if (cellList.length == 0) throw new Error('No more valid cells')

    // let cells = cellList.filter(
    //     (cell) => cell.candidates.length >= 3 && cell.candidates.length <= 6
    // )
    // if (cells.length == 0) cells = cellList
    //
    // let cell = rng.choice(cells)

    let cell = rng.choice(cellList)

    sudoku.grid[cell.r][cell.c].num = null
    sudoku.grid[cell.r][cell.c].is_hint = false
    count += 1

    if (!careful) {
        const max = sudoku.size - 1
        if (sudoku.grid[max - cell.r][max - cell.c].num != null) {
            sudoku.grid[max - cell.r][max - cell.c].num = null
            sudoku.grid[max - cell.r][max - cell.c].is_hint = false
            count += 1
        }
    }

    return count
}

/**
 * @param {Rng} rng
 * @param {Sudoku} sudoku
 */
function removeHard(rng, sudoku, careful = false) {
    let count = 0
    let cellList = getHintList(sudoku)
    if (cellList.length == 0) throw new Error('No more valid cells')

    let cells = cellList.filter(
        (cell) => cell.candidates.length >= 4 && cell.candidates.length <= 9
    )
    if (cells.length == 0) cells = [...cellList]

    let cell = rng.choice(cells)

    sudoku.grid[cell.r][cell.c].num = null
    sudoku.grid[cell.r][cell.c].is_hint = false
    count += 1

    if (!careful) {
        const max = sudoku.size - 1
        if (sudoku.grid[max - cell.r][max - cell.c].num != null) {
            sudoku.grid[max - cell.r][max - cell.c].num = null
            sudoku.grid[max - cell.r][max - cell.c].is_hint = false
            count += 1
        }
    }

    return count
}

/**
 * @param {Sudoku} sudoku
 * @returns {{r: number, c: number, candidates: number[]}[]}
 */
function getHintList(sudoku) {
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

/**
 * @param {Sudoku} sudoku
 * @returns {{r: number, c: number, candidates: number[]}[]}
 */
function getEmptyCellList(sudoku) {
    let list = []
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].num != null) continue

            list.push({
                r: r,
                c: c,
                candidates: [...sudoku.grid[r][c].candidates],
            })
        }
    }

    // return list.sort((a, b) => a.candidates.length <= b.candidates.length)
    return list
}
