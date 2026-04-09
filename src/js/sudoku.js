import { stopTimer } from "./timer_function.js";


export class Sudoku {
    constructor(region_width, region_height) {
        this.size = region_width * region_height
        this.region_width = region_width
        this.region_height = region_height

        this.grid = []
        for (let r = 0; r < this.size; r++) {
            this.grid.push([])
            for (let c = 0; c < this.size; c++) {
                this.grid[r].push(null)
            }
        }

        this.mark_cell = (row, col, is_marked = true) => {
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
    }
}

// Example function
export function make_full_grid(sudoku) {
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            sudoku.grid[r][c] = new Cell(1, true)
        }
    }
}

// Example function
export function make_simple_solved_grid(sudoku) {
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            sudoku.grid[r][c] = new Cell(
                ((3 * (r % 3) + Math.floor(r / 3) + c) % 9) + 1,
                true
            )
        }
    }
}

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

function switch_nums(sudoku, rand) {
    let from = rand.nextRange(0, sudoku.size) + 1
    let to = rand.nextRange(0, sudoku.size) + 1

    let replaced = []
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].num == to) {
                sudoku.grid[r][c].num = from
            } else if (sudoku.grid[r][c].num == from) {
                sudoku.grid[r][c].num = to
            }
        }
    }
    // for (let i = 0; i < replaced.length; i++) {
    //     let r = replaced[i][0]
    //     let c = replaced[i][1]
    //     sudoku.grid[r][c].num =
    // }
}

export class Cell {
    constructor(
        num,
        is_hint = false,
        to_html_fn = () => default_to_html(this),
        solution,
        candidates = []
    ) {
        this.num = num
        this.solution = num
        this.is_hint = is_hint
        this.candidates = candidates
        this.is_collapsed = () => this.num != null
        this.is_marked = false
        // If the cell is marked by associativity
        this.is_assoc_marked = false

        this.set_marked = (is_marked) => (this.is_marked = is_marked)

        this.to_html = to_html_fn
    }
}
function default_to_html(cell) {
    let container = document.createElement('span')
    if (cell.is_collapsed()) {
        container.className = 'sudoku-num'

        container.innerText = `${cell.num}`
    } else if (cell.candidates.length > 0) {
        container = document.createElement('div')
        container.className = 'sudoku-candidates'

        // TODO: Make the cell know how big the parent sudoku is.
        // This can be done in multiple ways:
        // - By giving the parent as a field on each cell ( cell.parent.size )
        // - By giving the size as a field on each cell ( cell.parent_size )
        // - By giving the sudoku as a parameter to this function ( cell.to_html(sudoku) )
        for (let i = 0; i < 9; i++) {
            let cand = document.createElement('span')
            cand.className = 'sudoku-candidate'

            if (cell.candidates.includes(i + 1)) cand.innerText = i + 1
            container.appendChild(cand)
        }
    }

    if (cell.is_hint) {
        container.className += ' hint'
    }

    if (cell.is_marked) {
        container.className += ' marked'
    }

    if (cell.is_assoc_marked && cell.num != null) {
        container.className += ' marked-assoc'
    }

    return container
}

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
    const totalMs = stopTimer(); // Temporary time stopper.
    alert('Hurray! The Sudoku is correct!')
    return true
}
