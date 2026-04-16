import { Sudoku } from './sudoku.js'

/**
 * Tries to solve a cell on the board with a naked single
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a naked single, False if not
 */
function naked_single(sudoku) {
    // Find an instance of a naked single
    // Update the board
    // Return true, or false if no naked single was found
}

/**
 * Tries to solve a cell on the board with a naked pair
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a naked pair, False if not */
function naked_pair(sudoku) {
    // Find an instance of a naked pair
    // Update the board
    // Return true, or false if no naked pair was found
}

/**
 * Tries to solve a cell on the board with a hidden single
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a hidden single, False if not
 */
function hidden_single(sudoku) {
    // Find an instance of a hidden single
    // Update the board
    // Return true, or false if no hidden single was found
}

/**
 * Tries to solve a cell on the board with a hidden pair
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a hidden pair, False if not */
function hidden_pair(sudoku) {
    // Find an instance of a hidden pair
    // Update the board
    // Return true, or false if no hidden pair was found
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].num == null) {
                let region_r_min =
                    Math.floor(r / sudoku.region_height) * sudoku.region_height
                let region_r_max = region_r_min + sudoku.region_height - 1
                let region_c_min =
                    Math.floor(c / sudoku.region_width) * sudoku.region_width
                let region_c_max = region_c_min + sudoku.region_width - 1

                for (
                    let inner_r = region_r_min;
                    inner_r < region_r_max;
                    inner_r++
                ) {
                    for (
                        let inner_c = region_c_min;
                        region_c_min < region_c_max;
                        region_c_min++
                    ) {
                        if (
                            sudoku.grid[inner_r][inner_c].num == null &&
                            inner_r != r &&
                            inner_c != c
                        ) {
                            const focusedCellCandidates = new Set(
                                sudoku.grid[r][c].candidates
                            )
                            const lookupCellCandidates = new Set(
                                sudoku.grid[inner_r][inner_c].candidates
                            )
                            if (
                                focusedCellCandidates.intersection(
                                    lookupCellCandidates
                                ) == 2
                            ) {
                                let commonCandidates = []
                                for (
                                    let candidateFind = 0;
                                    candidateFind <
                                    sudoku.grid[r][c].candidates.length;
                                    candidateFind++
                                ) {
                                    let found = binarySearch(
                                        sudoku.grid[inner_r][inner_c]
                                            .candidates,
                                        candidateFind
                                    )
                                    commonCandidates.push(found)
                                    sudoku.grid[r][c].candidates =
                                        commonCandidates
                                    sudoku.grid[inner_r][inner_c].candidates =
                                        commonCandidates
                                    return true
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return false
}

/**
 * Tries to solve a cell on the board with an x-wing
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find an x-wing, False if not */
function x_wing(sudoku) {}

/**
 * Tries to solve a cell on the board with a y-wing
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a y-wing, False if not */
function y_wing(sudoku) {}

/**
 * Tries to solve a cell on the board with a swordfish
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a swordfish, False if not */
function swordfish(sudoku) {}

function binarySearch(array, target) {
    let left = 0
    let right = array.length - 1
    while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        if (array[mid] === target) return mid
        if (array[mid] < target) left = mid + 1
        else right = mid - 1
    }
    return -1
}
