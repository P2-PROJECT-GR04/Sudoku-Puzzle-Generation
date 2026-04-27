import { Sudoku, deepCopy } from './sudoku.js'
import { find_candidates_for_cell } from './check-hint.js'

/**
 * @typedef {Object} Trace
 * @property {number[]} candidates
 * @property {Sudoku} sudoku
 */

/**
 * Checks if a Sudoku has only one solution.
 * @param {Sudoku} sudoku
 * @returns {boolean}
 */
export function has_one_solution(sudoku) {
    /** @type {Trace[]} */
    let trace = []
    let currentCandidates = null
    let currentSudoku = deepCopy(sudoku)
    let found_solution = false
    while (!full_grid(currentSudoku) || trace.length != 0) {
        if (trace.length >= 3000) {
            throw new Error('Infinite loop detected')
        }
        let cell = lowest_candidates(currentSudoku)
        if (currentCandidates != null) {
            currentSudoku.grid[cell.r][cell.c].candidates = [
                ...currentCandidates,
            ]
            currentCandidates = null
        }
        if (currentSudoku.grid[cell.r][cell.c].candidates.length == 0) {
            if (trace.length == 0) {
                // -> No solution found
                return false
            }
            let t = trace.pop()
            currentSudoku = deepCopy(t.sudoku)
            currentCandidates = [...t.candidates]
            continue
        } else if (currentSudoku.grid[cell.r][cell.c].candidates.length == 1) {
            currentSudoku.grid[cell.r][cell.c].num =
                currentSudoku.grid[cell.r][cell.c].candidates.pop()
        } else {
            let candidate = currentSudoku.grid[cell.r][cell.c].candidates.pop()
            trace.push({
                sudoku: deepCopy(currentSudoku),
                candidates: [...currentSudoku.grid[cell.r][cell.c].candidates],
            })
            currentSudoku.grid[cell.r][cell.c].num = candidate
        }
        if (full_grid(currentSudoku)) {
            if (found_solution) {
                return false
            } else {
                found_solution = true
                if (trace.length == 0) {
                    return true
                }
                let t = trace.pop()
                currentSudoku = deepCopy(t.sudoku)
                currentCandidates = [...t.candidates]
            }
        }
    }
    return true
}

/**
 * Checks if a Sudoku has a collapsed number in all of its cells
 * @param {Sudoku} sudoku
 * @returns {boolean}
 */
function full_grid(sudoku) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (sudoku.grid[r][c].num == null) {
                return false
            }
        }
    }
    return true
}

/**
 * @typedef {Object} CellRef - Reference a cell
 * @property {number} r - The row of the referenced cell
 * @property {number} c - The column of the referenced cell
 * @property {number[]} candidates - The candidates of the referenced cell
 */

/**
 * Finds the cell with the lowest amount of candidates
 * @param {Sudoku} sudoku
 * @returns {CellRef}
 */
function lowest_candidates(sudoku) {
    /** @type {CellRef} */
    let currentLowest = {
        r: null,
        c: null,
        candidates: null,
    }
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].is_collapsed()) {
                continue
            }
            find_candidates_for_cell(sudoku, r, c)
            if (
                currentLowest.candidates == null ||
                currentLowest.candidates.length >
                    sudoku.grid[r][c].candidates.length
            ) {
                currentLowest.r = r
                currentLowest.c = c
                currentLowest.candidates = sudoku.grid[r][c].candidates
            }
        }
    }
    return currentLowest
}
