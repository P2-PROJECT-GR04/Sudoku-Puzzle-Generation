import { Sudoku } from './sudoku.js'

function get_units(sudoku) {
    const units = []

    // Checks for rows
    for (let r = 0; r < sudoku.size; r++) {
        const unit = []
        for (let c = 0; c < sudoku.size; c++) unit.push([r, c])
        units.push(unit)
    }

   // checks for columns
    for (let c = 0; c < sudoku.size; c++) {
        const unit = []
        for (let r = 0; r < sudoku.size; r++) unit.push([r, c])
        units.push(unit)
    }

    /* 
    Checks for region (3x3)
    Outer loops
    */
    for (let b = 0; b < sudoku.region_height; b++) {
        for (let d = 0; d < sudoku.region_width; d++) {
            const unit = []
            /* 
            Checks each cells
            Inner loop
            */
            for (let r = 0; r < sudoku.region_height; r++) {
                for (let c = 0; c < sudoku.region_width; c++) {
                    unit.push([b * sudoku.region_height + r, d * sudoku.region_width + c])
                }
            }
            units.push(unit)
        }
    }
    return units
}
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
        for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].num == null && sudoku.grid[r][c].candidates.length == 1) {
            sudoku.grid[r][c].num = sudoku.grid[r][c].candidates[0]
                return true
            }
        }
    }
    return false
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

    function Samecandidates(arr1, arr2) {
        return (
            arr1.length === 2 &&
            arr2.length === 2 &&
            arr1[0] === arr2[0] &&
            arr1[1] === arr2[1]
        )
    }
    /* det her er bare en hjælpe funktion til at finde et de celler der kun har 2 kandidater 
    det gøre vi ved at se om den har et array længere end 2 
    hvis den har det returner den false da vi bruger && til arr1.length skal være lige med 2 fx. */

     for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {

            const cell = sudoku.grid[r][c]

            if (cell.num == null && cell.candidates.length === 2) {

                let region_r_min =
                    Math.floor(r / sudoku.region_height) * sudoku.region_height
                let region_r_max = region_r_min + sudoku.region_height

                let region_c_min =
                    Math.floor(c / sudoku.region_width) * sudoku.region_width
                let region_c_max = region_c_min + sudoku.region_width

                for (let inner_r = region_r_min; inner_r < region_r_max; inner_r++) {
                    for (let inner_c = region_c_min; inner_c < region_c_max; inner_c++) {

                        if (inner_r === r && inner_c === c) continue

                        const otherCell = sudoku.grid[inner_r][inner_c]

                        if (
                            otherCell.num == null &&
                            samePair(cell.candidates, otherCell.candidates)
                        ) {

                            const pair = [...cell.candidates]

                            for (let remove_r = region_r_min; remove_r < region_r_max; remove_r++) {
                                for (let remove_c = region_c_min; remove_c < region_c_max; remove_c++) {

                                    if (
                                        (remove_r === r && remove_c === c) ||
                                        (remove_r === inner_r && remove_c === inner_c)
                                    ) {
                                        continue
                                    }

                                    const target = sudoku.grid[remove_r][remove_c]

                                    if (target.num == null) {
                                        const oldLength = target.candidates.length

                                        target.candidates =
                                            target.candidates.filter(
                                                n => n !== pair[0] && n !== pair[1]
                                            )

                                        if (target.candidates.length !== oldLength) {
                                            return true
                                        }
                                    }
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
 * Tries to solve a cell on the board with a hidden single
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a hidden single, False if not
 */
function hidden_single(sudoku) {
    // Find an instance of a hidden single
    // Update the board
    // Return true, or false if no hidden single was found

    // Looks at one row, one column or one region (one at a time)
    for (const unit of get_units(sudoku)) {
    const unsolved = unit.filter(([r, c]) => sudoku.grid[r][c].num === null) //Ignores already solved cells

        for (let d = 1; d <= sudoku.size; d++) {
            const cells = unsolved.filter(([r, c]) => sudoku.grid[r][c].candidates.includes(d)) // Checks for candidates

            /*
            Hidden single condition
            If a number can go only be placed in unit
            */
            if (cells.length === 1) {
            const [r, c] = cells[0]
            sudoku.grid[r][c].num = d
            sudoku.grid[r][c].candidates = []
            return true
            }
        }
    }
    return false
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
                                    if (found == -1) {
                                        continue
                                    }
                                    commonCandidates.push(found)
                                }
                                sudoku.grid[r][c].candidates = commonCandidates
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
        if (array[mid] == target) return mid
        if (array[mid] < target) left = mid + 1
        else right = mid - 1
    }
    return -1
}
