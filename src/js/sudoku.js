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

export function make_solved_grid(sudoku) {
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            sudoku.grid[r][c] = new Cell(
                ((3 * (r % 3) + Math.floor(r / 3) + c) % 9) + 1,
                true
            )
        }
    }

    // Switch cols n² times
    for (let i = 0; i < sudoku.size * sudoku.size; i++) {
        let region_idx = Math.floor(Math.random() * sudoku.region_height)
        let from =
            region_idx * sudoku.region_width +
            Math.floor(Math.random() * sudoku.region_width)
        let to =
            region_idx * sudoku.region_width +
            Math.floor(Math.random() * sudoku.region_width)

        for (let r = 0; r < sudoku.size; r++) {
            let tmp = sudoku.grid[r][to]
            sudoku.grid[r][to] = sudoku.grid[r][from]
            sudoku.grid[r][from] = tmp
        }
    }

    // Switch rows n² times
    for (let i = 0; i < sudoku.size * sudoku.size; i++) {
        let region_idx = Math.floor(Math.random() * sudoku.region_width)
        let from =
            region_idx * sudoku.region_height +
            Math.floor(Math.random() * sudoku.region_height)
        let to =
            region_idx * sudoku.region_height +
            Math.floor(Math.random() * sudoku.region_height)

        let tmp = sudoku.grid[to]
        sudoku.grid[to] = sudoku.grid[from]
        sudoku.grid[from] = tmp
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

        this.to_html = to_html_fn
    }
}
function default_to_html(cell) {
    if (cell.is_collapsed()) {
        let span = document.createElement('span')

        span.className = 'sudoku-num'
        if (cell.is_hint) {
            span.className += ' hint'
        }

        span.innerText = `${cell.num}`
        return span
    } else {
        let span = document.createElement('span')
        span.className = 'sudoku-num'
        return span
    }
}
