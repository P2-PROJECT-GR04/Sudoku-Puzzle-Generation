import { stopTimer } from './timer_function.js'
import { Rng } from './rand.js'
import { Cell } from './cell.js'

/**
 * A Sudoku board represented by a 2D-grid
 * @class
 * @property {number} size - The max number that can be in the Sudoku. This is the same as the height and width of the sudoku
 * @property {number} region_width - The number of columns in a region
 * @property {number} region_height - The number of rows in a region
 * @property {Cell[][]} grid - The 2D-grid representing the cells of the Sudoku
 * @property {number[] | null} marked_cell - The cell that is currently marked by the user. This is null if no cell is marked
 * @property {(row: number, col: number, is_marked: boolean) => void} mark_cell - Mark a given cell
 * @property {(row: number, col: number, fn: (r: number, c: number) => void) => void} forRegion - Run the given function `fn` on each cell in the region
 * @property {(fn: (r: number, c: number) => void) => void} forCells - Run the given function `fn` on each cell in the grid
 */
export class Sudoku {
    /**
     * Constructs a new Sudoku
     * @constructor
     * @param {number} region_width - The number of columns in a region
     * @param {number} region_height - The number of rows in a region
     */
    constructor(region_width, region_height) {
        /** @readonly */
        this.size = region_width * region_height
        /** @readonly */
        this.region_width = region_width
        /** @readonly */
        this.region_height = region_height

        /** @type {Cell[][]} */
        this.grid = []
        for (let r = 0; r < this.size; r++) {
            this.grid.push([])
            for (let c = 0; c < this.size; c++) {
                this.grid[r].push(new Cell(null))
            }
        }

        /** @type {number[] | null} */
        this.marked_cell = null
        /** @readonly */
        this.mark_cell = (row, col, is_marked = true) => {
            this.marked_cell = [row, col]
            this.is_marked = is_marked
            this.grid[row][col].is_marked = is_marked

            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size; c++) {
                    if (
                        this.grid[r][c].num == this.grid[row][col].num &&
                        !(row == r && col == c)
                    ) {
                        this.grid[r][c].is_assoc_marked = is_marked
                    }
                }
            }
        }

        this.transpose = () => {
            let new_grid = []
            for (let r = 0; r < this.size; r++) {
                new_grid.push([])
                for (let c = 0; c < this.size; c++) {
                    new_grid[r].push(null)
                }
            }

            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size; c++) {
                    new_grid[c][r] = this.grid[r][c]
                }
            }

            this.grid = new_grid

            const tmp_width = this.region_width
            this.region_width = this.region_height
            this.region_height = tmp_width
        }

        this.forRegion = (r, c, fn) => {
            let r_min = Math.floor(r / this.region_height) * this.region_height
            let r_max = r_min + this.region_height

            let c_min = Math.floor(c / this.region_width) * this.region_width
            let c_max = c_min + this.region_width

            for (let ri = r_min; ri < r_max; ri++) {
                for (let ci = c_min; ci < c_max; ci++) {
                    fn(ri, ci)
                }
            }
        }

        this.forCells = (fn) => {
            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size; c++) {
                    fn(r, c)
                }
            }
        }
    }
}

/**
 * Removes hint cells from a fully formed valid Sudoky grid
 * @modifies {sudoku}
 * @param {Sudoku} sudoku - The Sudoku to remove from
 * @param {Rng} rand - The random number generator to use
 */
export function remove_cells(sudoku, rand) {
    for (let i = 0; i < (sudoku.size * sudoku.size) / 2; i++) {
        let r = rand.nextRange(0, sudoku.size)
        let c = rand.nextRange(0, sudoku.size)
        sudoku.grid[r][c].num = null
        sudoku.grid[r][c].is_hint = false
    }
}

/**
 * Converts a Sudoku into a random solved grid
 * @param {Sudoku} sudoku - The Sudoku to convert to a solved grid
 * @param {Rng} rand - The random number generator to use
 */
export function make_solved_grid(sudoku, rand) {
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            // (w * (r % h) + floor(r / h) + c) % s
            const cell =
                ((sudoku.region_width * (r % sudoku.region_height) +
                    Math.floor(r / sudoku.region_height) +
                    c) %
                    sudoku.size) +
                1

            sudoku.grid[r][c] = new Cell(cell, true)
        }
    }

    // Transform 20 * n² times
    for (let i = 0; i < 20 * sudoku.size * sudoku.size; i++) {
        let choice = rand.nextRange(0, 3)
        if (choice == 0) {
            switch_rows(sudoku, rand)
        } else if (choice == 1) {
            switch_columns(sudoku, rand)
        } else if (choice == 2) {
            switch_nums(sudoku, rand)
        }
    }
}

/**
 * Randomly switches two rows in a random region, from a given Sudoku
 * @modifies {sudoku}
 * @param {Sudoku} sudoku - The Sudoku
 * @param {Rng} rand - The random number generator to use
 */
function switch_rows(sudoku, rand) {
    let region_idx = rand.nextRange(0, sudoku.region_width)

    let from =
        region_idx * sudoku.region_height +
        rand.nextRange(0, sudoku.region_height)

    let to =
        region_idx * sudoku.region_height +
        rand.nextRange(0, sudoku.region_height)

    let tmp = sudoku.grid[to]
    sudoku.grid[to] = sudoku.grid[from]
    sudoku.grid[from] = tmp
}

/**
 * Randomly switches two columns in a random region, from a given Sudoku
 * @modifies {sudoku}
 * @param {Sudoku} sudoku - The Sudoku
 * @param {Rng} rand - The random number generator to use
 */
function switch_columns(sudoku, rand) {
    let region_idx = rand.nextRange(0, sudoku.region_height)

    let from =
        region_idx * sudoku.region_width +
        rand.nextRange(0, sudoku.region_width)

    let to =
        region_idx * sudoku.region_width +
        rand.nextRange(0, sudoku.region_width)

    for (let r = 0; r < sudoku.size; r++) {
        let tmp = sudoku.grid[r][to]
        sudoku.grid[r][to] = sudoku.grid[r][from]
        sudoku.grid[r][from] = tmp
    }
}

/**
 * Randomly switches two numbers from a given Sudoku
 * @modifies {sudoku}
 * @param {Sudoku} sudoku - The Sudoku
 * @param {Rng} rand - The random number generator to use
 */
function switch_nums(sudoku, rand) {
    let from = rand.nextRange(0, sudoku.size) + 1
    let to = rand.nextRange(0, sudoku.size) + 1

    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].num == to) {
                sudoku.grid[r][c].num = from
                sudoku.grid[r][c].solution = from
            } else if (sudoku.grid[r][c].num == from) {
                sudoku.grid[r][c].num = to
                sudoku.grid[r][c].solution = to
            }
        }
    }
}

/**
 * Checks if a Sudoku is correct
 * @param {Sudoku} sudoku - The Sudoku to check
 */
export function check_board(sudoku) {
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].is_hint == false) {
                if (sudoku.grid[r][c].num == sudoku.grid[r][c].solution) {
                    continue
                } else {
                    alert('ERROR - The Sudoku is not correct ):')
                    return false
                }
            }
        }
    }
    stopTimer() // Temporary time stopper.
    alert('Hurray! The Sudoku is correct!')
    return true
}

/**
 * Creates a new sudoku from a NxN grid of numbers
 * @param {(number | null)[][]} grid
 * @returns {Sudoku | null}
 */
export function sudoku_from_grid(width, height, grid) {
    let new_grid = grid.map((row) => row.map((cell) => new Cell(cell)))

    for (let row of new_grid) {
        if (row.length != new_grid.length) {
            console.log(`Uneven. Expected row to have len ${new_grid.length}, got ${row.length}`)
            return null
        }
    }

    if (
        new_grid.length != width * height
    )
        return null

    let sudoku = new Sudoku(width, height)
    sudoku.grid = new_grid
    return sudoku
}
