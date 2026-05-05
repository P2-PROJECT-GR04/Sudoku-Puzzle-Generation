import { Sudoku, sudoku_from_grid } from './sudoku.js'
import { Cell } from './cell.js'
import { find_candidates_for_grid } from './check-hint.js'
import {
    naked_single,
    naked_pair,
    hidden_single,
    hidden_pair,
    x_wing,
    y_wing,
    swordfish,
} from './solvers.js'


/**
 * Deep copies a Sudoku board
 * @param {Sudoku} sudoku
 * @returns {Sudoku}
 */
function deepCopy(sudoku) {
    let new_sudoku = new Sudoku(sudoku.region_width, sudoku.region_height)

    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            new_sudoku.grid[r][c] = new Cell(sudoku.grid[r][c].num)
            new_sudoku.grid[r][c].candidates = [...sudoku.grid[r][c].candidates]
        }
    }

    return new_sudoku
}

/**
 * Checks if the sudoku is fully solved (all cells have a number)
 * @param {Sudoku} sudoku
 * @returns {boolean}
 */
function is_solved(sudoku) {
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].num == null) return false
        }
    }
    return true
}


/**
 * Checks if the sudoku is unsolvable (any empty cell has 0 candidates)
 * @param {Sudoku} sudoku
 * @returns {boolean}
 */
function is_unsolvable(sudoku) {
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].num == null && sudoku.grid[r][c].candidates.length == 0) {
                return true
            }
        }
    }
    return false
}

/**
 * Finds the empty cell with fewest candidates
 * @param {Sudoku} sudoku
 * @returns {{r: number, c: number} | null}
 */
function findBestCell(sudoku) {
    let bestCell = null
    let bestCount = Infinity
 
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            const cell = sudoku.grid[r][c]
            if (cell.num == null && cell.candidates.length > 0) {
                if (cell.candidates.length < bestCount) {
                    bestCount = cell.candidates.length
                    bestCell = { r, c }
                } // loop which finds the cell with fewest candidates on the grid
            }
        }
    }
    return bestCell
}

/**
 * Places a given candidate in a given cell
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @param {{r: number, c: number}} cell - the cell to guess in
 * @param {number} candidate - the candidate to place
 */
// Guess takes cell and candidate as parameters instead of finding them internally 
function guess(sudoku, cell, candidate) {
    sudoku.grid[cell.r][cell.c].num = candidate
}

/**
 * Updates candidates for all cells by only removing candidates
 * that are no longer valid due to placed numbers.
 * Never adds candidates - preserves any eliminations made by solvers.
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 */
export function update_candidates(sudoku) {
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].num != null) continue
            
            // Remove candidates if possible
            sudoku.grid[r][c].candidates = sudoku.grid[r][c].candidates.filter(cand => {
                // remove if in row
                for (let inner_r = 0; inner_r < sudoku.size; inner_r++) {
                    if (sudoku.grid[inner_r][c].num == cand) return false
                }
                // remove if in column
                for (let inner_c = 0; inner_c < sudoku.size; inner_c++) {
                    if (sudoku.grid[r][inner_c].num == cand) return false
                }
                // remove if in region
                const region_r_min = Math.floor(r / sudoku.region_height) * sudoku.region_height
                const region_r_max = region_r_min + sudoku.region_height
                const region_c_min = Math.floor(c / sudoku.region_width) * sudoku.region_width
                const region_c_max = region_c_min + sudoku.region_width
                for (let ri = region_r_min; ri < region_r_max; ri++) {
                    for (let ci = region_c_min; ci < region_c_max; ci++) {
                        if (sudoku.grid[ri][ci].num == cand) return false
                    }
                }
                return true // keep this candidate
            })
        }
    }
}
 
/**
 * Grades a sudoku board by looping over solvers and adding 
 * a difficulty score based on which techniques are needed
 * @param {Sudoku} sudoku - The sudoku to grade (will not be modified)
 * @returns {number} The difficulty grade
 */
export function grade(sudoku) {
    // work on a copy so we dont modify the original board
    let currentSudoku = deepCopy(sudoku)
    let gradeScore = 0
 
    // history entries store guessCell and triedCandidates 
    /** @type {{sudoku: Sudoku, grade: number, guessCell: {r: number, c: number}, triedCandidates: number[]}[]} */
    let history = []
 
    // calculate initial candidates
    find_candidates_for_grid(currentSudoku)
 
    while (!is_solved(currentSudoku)) {
 
        // if unsolvable, backtrack to last saved state
        if (is_unsolvable(currentSudoku)) {
            if (history.length == 0) {
                console.warn('Grader: unsolvable with no history - aborting')
                break
            }
            const last = history.pop()
            currentSudoku = last.sudoku
            gradeScore = last.grade
 
            // find next untried candidate instead of always using candidates[0] (i had this as a static "guess" in the findBestCell function in an earlier version)
            const cell = currentSudoku.grid[last.guessCell.r][last.guessCell.c]
            const nextCandidate = cell.candidates.find(c => !last.triedCandidates.includes(c))
 
            if (nextCandidate == undefined) {
                // all candidates tried in this cell, backtrack further to previous history entry 
                continue
            }
 
            // try next candidate and push back to history with updated triedCandidates 
            last.triedCandidates.push(nextCandidate)
            history.push(last)
            guess(currentSudoku, last.guessCell, nextCandidate)
            update_candidates(currentSudoku)
            continue
        }
 
        if (naked_single(currentSudoku)) {
            update_candidates(currentSudoku) // places a number, refresh needed
            gradeScore += 0.1
            continue
        }
 
        if (naked_pair(currentSudoku)) {
            // only eliminates candidates, no refresh needed
            gradeScore += 0.2
            continue
        }
 
        if (hidden_single(currentSudoku)) {
            update_candidates(currentSudoku) // places a number, refresh needed
            gradeScore += 0.2
            continue
        }
 
        if (hidden_pair(currentSudoku)) {
            // only eliminates candidates, no refresh needed
            gradeScore += 0.2
            continue
        }
 
        if (x_wing(currentSudoku)) {
            // only eliminates candidates, no refresh needed
            gradeScore += 0.5
            continue
        }
 
        if (y_wing(currentSudoku)) {
            // only eliminates candidates, no refresh needed
            gradeScore += 0.6
            continue
        }
 
        if (swordfish(currentSudoku)) {
            // only eliminates candidates, no refresh needed
            gradeScore += 0.6
            continue
        }
 
        // nothing worked - save state and make a guess
        // find best cell first so we can store it in history 
        const bestCell = findBestCell(currentSudoku)
        if (bestCell == null) break // no valid cell found, board is stuck
 
        const firstCandidate = currentSudoku.grid[bestCell.r][bestCell.c].candidates[0]
 
        history.push({ // we push this sudoku into history to retrieve it with pop later if our guess turns out to be incorrect
            sudoku: deepCopy(currentSudoku),
            grade: gradeScore, // we save grade as well as we only grade +1 when we guess something that can lead us to a solved sudoku
            guessCell: bestCell,               // store which cell we have guessed in 
            triedCandidates: [firstCandidate], // store which candidates we have tried
        })
        guess(currentSudoku, bestCell, firstCandidate) // pass cell and candidate 
        update_candidates(currentSudoku) // refresh after placing a number
        gradeScore += 1.0
    }
 
    return gradeScore // number to be used as a threshold in remove_cells 
}

// Difficulty indexing idea? Dont know about actual number to use here?
/**
 * Converts a numeric grade to a difficulty label
 * @param {number} grade
 * @returns {string} "Easy", "Medium" or "Hard"
 */
export function grade_to_difficulty(grade) {
    if (grade < 5) return "Easy"
    if (grade < 15) return "Medium"
    return "Hard"
}

