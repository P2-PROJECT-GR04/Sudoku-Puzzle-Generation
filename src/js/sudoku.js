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

export class Cell {
    constructor(
        num,
        is_hint = false,
        to_html_fn = () => default_to_html(this)
    ) {
        this.num = num
        this.is_hint = is_hint
        this.is_collapsed = () => this.num != null
        this.is_marked = false
        // If the cell is marked by associativity
        this.is_assoc_marked = false

        this.set_marked = (is_marked) => (this.is_marked = is_marked)

        this.to_html = to_html_fn
    }
}
function default_to_html(cell) {
    let span = document.createElement('span')

    span.className = 'sudoku-num'

    if (cell.is_hint) {
        span.className += ' hint'
    }

    if (cell.is_marked) {
        span.className += ' marked'
    }

    if (cell.is_assoc_marked && cell.num != null) {
        span.className += ' marked-assoc'
    }

    if (cell.is_collapsed()) {
        span.innerText = `${cell.num}`
    }

    return span
}
