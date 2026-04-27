import { Sudoku } from './sudoku.js'

/**
 * Tries to solve a cell on the board with a naked single
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a naked single, False if not
 */
export function naked_single(sudoku) {
    // Find an instance of a naked single
    // Update the board
    // Return true, or false if no naked single was found
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (
                sudoku.grid[r][c].num == null &&
                sudoku.grid[r][c].candidates.length == 1
            ) {
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
export function naked_pair(sudoku) {
    // Find an instance of a naked pair
    // Update the board
    // Return true, or false if no naked pair was found

    function same_candidates(arr1, arr2) {
        return (
            arr1.length == 2 &&
            arr2.length == 2 &&
            arr1[0] == arr2[0] &&
            arr1[1] == arr2[1]
        )
    }
    /* det her er bare en hjælpe funktion til at finde et de celler der kun har 2 kandidater 
    det gøre vi ved at se om den har et array længere end 2 
    hvis den har det returner den false da vi bruger && til arr1.length skal være lige med 2 fx. */

    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            const cell = sudoku.grid[r][c]

            if (cell.num == null && cell.candidates.length == 2) {
                const pair = [...cell.candidates]

                let region_r_min =
                    Math.floor(r / sudoku.region_height) * sudoku.region_height
                let region_r_max = region_r_min + sudoku.region_height

                let region_c_min =
                    Math.floor(c / sudoku.region_width) * sudoku.region_width
                let region_c_max = region_c_min + sudoku.region_width

                for (
                    let inner_r = region_r_min;
                    inner_r < region_r_max;
                    inner_r++
                ) {
                    for (
                        let inner_c = region_c_min;
                        inner_c < region_c_max;
                        inner_c++
                    ) {
                        if (inner_r == r && inner_c == c) continue

                        const otherCell = sudoku.grid[inner_r][inner_c]

                        if (
                            otherCell.num == null &&
                            same_candidates(
                                cell.candidates,
                                otherCell.candidates
                            )
                        ) {
                            
                            for (
                                let remove_r = region_r_min;
                                remove_r < region_r_max;
                                remove_r++
                            ) {
                                for (
                                    let remove_c = region_c_min;
                                    remove_c < region_c_max;
                                    remove_c++
                                ) {
                                    if (
                                        (remove_r == r && remove_c == c) ||
                                        (remove_r == inner_r &&
                                            remove_c == inner_c)
                                    ) {
                                        continue
                                    }

                                    const target =
                                        sudoku.grid[remove_r][remove_c]

                                    if (target.num == null) {
                                        const oldLength =
                                            target.candidates.length

                                        target.candidates =
                                            target.candidates.filter(
                                                (n) =>
                                                    n != pair[0] && n != pair[1]
                                            )

                                        if (
                                            target.candidates.length !=
                                            oldLength
                                        ) {
                                            return true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                // Checking and solving in column:
                for (let col_check = 0; col_check < sudoku.size; col_check++) {
                    
                    if (cell == sudoku.grid[r][col_check]) continue

                    const otherCol = sudoku.grid[r][col_check]

                    if (otherCol.num == null && 
                        same_candidates(
                            cell.candidates,
                            otherCol.candidates
                        ) 
                    ) {
                        for (let remove_col = 0; remove_col < sudoku.size; remove_col++){
                            const target_col = sudoku.grid[r][remove_col];
                            if (target_col == otherCol || target_col == cell) continue
                            if (target_col.num == null) {
                                const oldLengt_c = target_col.candidates.length
                            
                                target_col.candidates = target_col.candidates.filter((n) => n != pair[0] && n != pair[1])
                            
                            if (target_col.candidates.length != oldLengt_c) {
                                return true
                            }
                        }
                        }
                    }
                }
                // Checking and solving in rows
                for (let row_check = 0; row_check < sudoku.size; row_check++) {

                    const otherRow = sudoku.grid[row_check][c];
                    if (otherRow == cell) continue
                    if (otherRow.num == null && same_candidates(cell.candidates, otherRow.candidates)) {
                        for (let remove_row = 0; remove_row < sudoku.size; remove_row++) {
                            const target_row = sudoku.grid[remove_row][c];
                            if (target_row == otherRow || target_row == cell) continue
                            if (target_row.num == null) {
                                const oldLength_r = target_row.candidates.length;

                                target_row.candidates = target_row.candidates.filter((n) => n != pair[0] && n != pair[1])

                            if (target_row.candidates.length != oldLength_r) {
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
 * Tries to solve a cell on the board with a hidden single
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a hidden single, False if not
 */
export function hidden_single(sudoku) {
    // Find an instance of a hidden single
    // Update the board
    // Return true, or false if no hidden single was found

    // Loop over every cell on the board
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            // Only look at unsolved cells
            if (sudoku.grid[r][c].num == null) {
                // Check for all unsolved cells in the same region (3x3)
                const otherCellsCandidates = new Set()
                sudoku.forRegion(r, c, (inner_r, inner_c) => {
                    // skip the focused cell itself (return continues inside this block)
                    if (inner_r == r && inner_c == c) return
                    if (sudoku.grid[inner_r][inner_c].num == null) {
                        for (const cand of sudoku.grid[inner_r][inner_c]
                            .candidates) {
                            otherCellsCandidates.add(cand)
                        }
                    }
                })

                const focusedCellCandidates = new Set(
                    sudoku.grid[r][c].candidates
                )

                // Check if any candidate in this cell does not appear in any other cell same region (3x3)
                for (const d of focusedCellCandidates) {
                    if (!otherCellsCandidates.has(d)) {
                        sudoku.grid[r][c].num = d
                        sudoku.grid[r][c].candidates = []
                        return true
                    }
                }
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
export function hidden_pair(sudoku) {
    // Find an instance of a hidden pair
    // Update the board
    // Return true, or false if no hidden pair was found
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].num == null && sudoku.grid[r][c].candidates.length > 2) {
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
                                    if (found == -1) continue
                                    if (commonCandidates != null) return false
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
export function x_wing(sudoku) {
    let x_wing_solve = () => {
        for (let r = 0; r < sudoku.size; r++) {
            for (let c = 0; c < sudoku.size; c++) {
                if (sudoku.grid[r][c].num != null) continue

                for (let r2 = r; r2 < sudoku.size; r2++) {
                    if (sudoku.grid[r2][c].num != null) continue
                    let left_strong_cands = is_strong_link(sudoku, r, c, r2, c)
                    if (left_strong_cands.length == 0) continue

                    for (let c2 = c; c2 < sudoku.size; c2++) {
                        if (sudoku.grid[r][c2].is_collapsed()) continue
                        if (sudoku.grid[r2][c2].is_collapsed()) continue
                        let right_strong_cands = is_strong_link(
                            sudoku,
                            r,
                            c2,
                            r2,
                            c2
                        )
                        if (right_strong_cands.length == 0) continue

                        let candidate = null
                        left_strong_cands.forEach((cand) => {
                            if (right_strong_cands.includes(cand))
                                candidate = cand
                        })

                        // if no shared candidate
                        if (candidate == null) continue

                        // X-Wing is valid
                        for (let r3 = 0; r3 < sudoku.size; r3++) {
                            for (let c3 = 0; c3 < sudoku.size; c3++) {
                                // Ignore the x-wing cells
                                if (
                                    (r3 == r && r3 == c) ||
                                    (r3 == r2 && c3 == c2)
                                )
                                    continue

                                sudoku.grid[r3][c3].candidates = sudoku.grid[
                                    r3
                                ][c3].filter((item) => item !== candidate)
                            }
                        }

                        return true
                    }
                }
            }
        }
    }

    // Check if it can find an xwing, if not, transpose and try again
    if (x_wing_solve()) {
        return true
    } else {
        sudoku.transpose()
        if (x_wing_solve()) {
            sudoku.transpose()
            return true
        }
        sudoku.transpose()
    }
    return false
}

/**
 * Tries to solve a cell on the board with a y-wing
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a y-wing, False if not */
export function y_wing(sudoku) {
    let cells = []
    for (let r = 0; r < sudoku.size; r++) {
        //Gets all the cells with 2 candidates into an array
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].candidates.length == 2) {
                cells.push([r, c])
            }
        }
    }
    for (let pivot of cells) {
        let see_cells = cells.filter((c) =>
            can_see(sudoku, pivot[0], pivot[1], c[0], c[1])
        )
        let pairs = possible_pairs(see_cells).filter(
            (p) => p[0] != pivot && p[1] != pivot
        )
        let pivotCell = sudoku.grid[pivot[0]][pivot[1]]
        for (let pair of pairs) {
            let pairCells = pair.map((c) => sudoku.grid[c[0]][c[1]])
            if (
                !(
                    (pairCells[0].candidates.includes(
                        pivotCell.candidates[0]
                    ) &&
                        pairCells[1].candidates.includes(
                            pivotCell.candidates[1]
                        )) ||
                    (pairCells[1].candidates.includes(
                        pivotCell.candidates[0]
                    ) &&
                        pairCells[0].candidates.includes(
                            pivotCell.candidates[1]
                        ))
                )
            )
                continue

            let has_removed = false

            if (
                !can_see(sudoku, pivot[0], pivot[1], pair[0][0], pair[0][1]) ||
                !can_see(sudoku, pivot[0], pivot[1], pair[1][0], pair[1][1])
            )
                continue

            const commonCandidate = pairCells[0].candidates.filter((value) =>
                pairCells[1].candidates.includes(value)
            )[0]

            if (
                commonCandidate == undefined ||
                pivotCell.candidates.includes(commonCandidate)
            ) {
                continue
            }
            let region_r1_min =
                Math.floor(pair[0][0] / sudoku.region_height) *
                sudoku.region_height
            let region_c1_min =
                Math.floor(pair[0][1] / sudoku.region_width) *
                sudoku.region_width
            let region_r2_min =
                Math.floor(pair[1][0] / sudoku.region_height) *
                sudoku.region_height
            let region_c2_min =
                Math.floor(pair[1][1] / sudoku.region_width) *
                sudoku.region_width

            if (
                region_r1_min == region_r2_min &&
                region_c1_min == region_c2_min
            ) {
                let region_r_min = region_r1_min
                let region_c_min = region_c1_min
                let region_r_max = region_r_min + sudoku.region_height - 1
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
                            (inner_r == pivot[0] && inner_c == pivot[1]) ||
                            (inner_r == pair[0][0] && inner_c == pair[0][1]) ||
                            (inner_r == pair[1][0] && inner_c == pair[1][1])
                        ) {
                            continue
                        }
                        if (sudoku.grid[inner_r][inner_c].num == null) {
                            let prev_len =
                                sudoku.grid[inner_r][inner_c].candidates.length

                            sudoku.grid[inner_r][inner_c].candidates =
                                sudoku.grid[inner_r][inner_c].candidates.filter(
                                    (c) => c != commonCandidate
                                )

                            if (
                                prev_len !=
                                sudoku.grid[inner_r][inner_c].candidates.length
                            )
                                has_removed = true
                        }
                    }
                }
            } else {
                if (
                    (pivot[0] != pair[0][0] || pivot[1] != pair[1][1]) &&
                    (pair[0][0] != pair[0][0] || pair[0][1] != pair[1][1]) &&
                    (pair[1][0] != pair[0][0] || pair[1][1] != pair[1][1])
                ) {
                    let prev_len =
                        sudoku.grid[pair[0][0]][pair[1][1]].candidates.length

                    sudoku.grid[pair[0][0]][pair[1][1]].candidates =
                        sudoku.grid[pair[0][0]][pair[1][1]].candidates.filter(
                            (c) => c != commonCandidate
                        )

                    if (
                        prev_len !=
                        sudoku.grid[pair[0][0]][pair[1][1]].candidates.length
                    )
                        has_removed = true
                }

                if ((pivot[0] != pair[1][0] || pivot[1] != pair[0][1]) &&
                    (pair[0][0] != pair[1][0] || pair[0][1] != pair[0][1]) &&
                    (pair[1][0] != pair[1][0] || pair[1][1] != pair[0][1])
                ) {
                    let prev_len =
                        sudoku.grid[pair[1][0]][pair[0][1]].candidates.length

                    sudoku.grid[pair[1][0]][pair[0][1]].candidates =
                        sudoku.grid[pair[1][0]][pair[0][1]].candidates.filter(
                            (c) => c != commonCandidate
                        )

                    if (
                        prev_len !=
                        sudoku.grid[pair[1][0]][pair[0][1]].candidates.length
                    )
                        has_removed = true
                }
            }
            if (has_removed) return true
        }
    }
    return false
}

/**
 * Tries to solve a cell on the board with a swordfish
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a swordfish, False if not */
export function swordfish(sudoku) {
    let swordfish_solver = () => {
        for (let r = 0; r < sudoku.size; r++) {
            for (let cand = 0; cand < sudoku.size; cand++) {
                let columns = []
                for (let c = 0; c < sudoku.size; c++) {
                    if (sudoku.grid[r][c].candidates.includes(cand)) {
                        columns.push(c)
                    }
                }

                if (columns.length != 3) continue

                let rows = []
                for (let r2 = r; r2 < sudoku.size; r2++) {
                    if (!sudoku.grid[r2][columns[0]].candidates.includes(cand))
                        continue
                    if (!sudoku.grid[r2][columns[1]].candidates.includes(cand))
                        continue
                    if (!sudoku.grid[r2][columns[2]].candidates.includes(cand))
                        continue

                    rows.push(r2)
                }

                if (rows.length != 3) continue

                for (let row = 0; row < sudoku.size; row++) {
                    if (rows.includes(row)) continue

                    for (let col of columns) {
                        sudoku.grid[row][col].candidates = sudoku.grid[row][
                            col
                        ].candidates.filter((c) => c != cand)
                    }
                }

                console.log(
                    `Removing ${cand}, withs rows: ${rows} and cols: ${columns}`
                )
                return true
            }
        }
        return false
    }

    if (swordfish_solver()) {
        return true
    } else {
        sudoku.transpose()
        if (swordfish_solver()) {
            sudoku.transpose()
            return true
        }
        sudoku.transpose()
    }

    return false
}

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

function is_strong_link(sudoku, r1, c1, r2, c2) {
    if (r1 == r2 && c1 == c2) return []

    let out = sudoku.grid[r1][c1].candidates.filter((x) =>
        sudoku.grid[r2][c2].candidates.includes(x)
    )

    if (r1 == r2) {
        for (let c3 = 0; c3 < sudoku.size; c3++) {
            out = out.filter((x) => !sudoku.grid[r1][c3].candidates.includes(x))
        }
    }

    if (c1 == c2) {
        for (let r3 = 0; r3 < sudoku.size; r3++) {
            out = out.filter((x) => !sudoku.grid[r3][c1].candidates.includes(x))
        }
    }

    return out
}

function can_see(sudoku, r1, c1, r2, c2) {
    if (r1 == r2 || c1 == c2) return true
    let region_r1_min =
        Math.floor(r1 / sudoku.region_height) * sudoku.region_height
    let region_c1_min =
        Math.floor(c1 / sudoku.region_width) * sudoku.region_width
    let region_r2_min =
        Math.floor(r2 / sudoku.region_height) * sudoku.region_height
    let region_c2_min =
        Math.floor(c2 / sudoku.region_width) * sudoku.region_width
    if (region_r1_min == region_r2_min && region_c1_min == region_c2_min)
        return true
    return false
}

function possible_pairs(list) {
    let pairs = []
    for (let i = 0; i < list.length; i++) {
        for (let j = i; j < list.length; j++) {
            if (i == j) continue
            pairs.push([list[i], list[j]])
        }
    }

    return pairs
}
