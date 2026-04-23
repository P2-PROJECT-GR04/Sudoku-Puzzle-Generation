import { Sudoku } from './sudoku.js'


    // Checks for rows
    for (let r = 0; r < sudoku.size; r++) {
        const unit = []
        for (let c = 0; c < sudoku.size; c++) unit.push([r, c])
        units.push(unit)
    }
    /*
   // checks for columns
    for (let c = 0; c < sudoku.size; c++) {
        const unit = []
        for (let r = 0; r < sudoku.size; r++) unit.push([r, c])
        units.push(unit)
    }
    */
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
                    unit.push([
                        b * sudoku.region_height + r,
                        d * sudoku.region_width + c,
                    ])
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
function naked_pair(sudoku) {
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
                            const pair = [...cell.candidates]

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
    // Loop over every cell on the board
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            // Only look at unsolved cells
            if (sudoku.grid[r][c].num == null) {
                // Find the top-left corner of the box this cell belongs to
                let region_r_min =
                    Math.floor(r / sudoku.region_height) * sudoku.region_height
                let region_r_max = region_r_min + sudoku.region_height
                let region_c_min =
                    Math.floor(c / sudoku.region_width) * sudoku.region_width
                let region_c_max = region_c_min + sudoku.region_width

    // Looks at one row, one column or one region (one at a time)
    for (const unit of get_units(sudoku)) {
        const unsolved = unit.filter(([r, c]) => sudoku.grid[r][c].num === null) //Ignores already solved cells

        for (let d = 1; d <= sudoku.size; d++) {
            const cells = unsolved.filter(([r, c]) =>
                sudoku.grid[r][c].candidates.includes(d)
            ) // Checks for candidates

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
function x_wing(sudoku) {
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].is_collapsed()) continue

            for (let r2 = r; r2 < sudoku.size; r2++) {
                if (sudoku.grid[r2][c].is_collapsed()) continue
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
                        if (right_strong_cands.includes(cand)) candidate = cand
                    })

                    // if no shared candidate
                    if (candidate == null) continue

                    // X-Wing is valid
                    for (let r3 = 0; r3 < sudoku.size; r3++) {
                        for (let c3 = 0; c3 < sudoku.size; c3++) {
                            // Ignore the x-wing cells
                            if ((r3 == r && r3 == c) || (r3 == r2 && c3 == c2))
                                continue

                            sudoku.grid[r3][c3].candidates = sudoku.grid[r3][
                                c3
                            ].filter((item) => item !== candidate)
                        }
                    }

                    return true
                }
            }
        }
    }
    return false
}

/**
 * Tries to solve a cell on the board with a y-wing
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a y-wing, False if not */
function y_wing(sudoku) {
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
            can_see(sudoku, cells[pivot][0], cells[pivot][1], c[0], c[1])
        )
        let pairs = possible_pairs(see_cells)
        let pivotCell = sudoku.grid[pivot[0]][pivot[1]]
        for (let pair of pairs) {
            let pairCells = pair.map((c) => sudoku.grid[c[0]][c[1]])
            if (
                (pairCells[0].candidates.includes(pivotCell.candidates[0]) &&
                    pairCells[1].candidates.includes(
                        pivotCell.candidates[1]
                    )) ||
                (pairCells[1].candidates.includes(pivotCell.candidates[0]) &&
                    pairCells[0].candidates.includes(pivotCell.candidates[1]))
            ) {
                if (
                    !can_see(
                        sudoku,
                        pivot[0],
                        pivot[1],
                        pair[0][0],
                        pair[0][1]
                    ) ||
                    !can_see(sudoku, pivot[0], pivot[1], pair[0][0], pair[0][1])
                ) {
                    countiue
                }
                const commonCandidate = pairCells[0].candidates.filter(
                    (value) => pairCells[1].candidates.includes(value)
                )[0]
                if (commonCandidate == undefined) {
                    countiue
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
                            if (inner_r == pivot[0] && inner_c == pivot[1]) {
                                countiue
                            }
                            if (sudoku.grid[inner_r][inner_c].num == null) {
                                sudoku.grid[inner_r][inner_c].candidates =
                                    sudoku.grid[inner_r][
                                        inner_c
                                    ].candidates.filter(
                                        (c) => c != commonCandidate
                                    )
                            }
                        }
                    }
                } else {
                    sudoku.grid[pair[0][0]][pair[1][1]].candidates =
                        sudoku.grid[pair[0][0]][pair[1][1]].candidates.filter(
                            (c) => c != commonCandidate
                        )
                    sudoku.grid[pair[1][0]][pair[0][1]].candidates =
                        sudoku.grid[pair[1][0]][pair[0][1]].candidates.filter(
                            (c) => c != commonCandidate
                        )
                }
                return true
            }
        }
    }
    return false
}

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

function is_strong_link(sudoku, r1, c1, r2, c2) {
    if (r1 == r2 && c1 == c2) return []

    let out = sudoku.grid[r1][c1].candidates.filter((x) =>
        sudoku.grid[r2][r3].candidates.includes(x)
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
            pairs.add([list[i], list[j]])
        }
    }

    return pairs
}
