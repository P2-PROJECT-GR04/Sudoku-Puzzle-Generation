export class Sudoku {
    size: number
    region_width: number
    region_height: number
    grid: (Cell | null)[][]

    public constructor(region_width: number, region_height: number) {
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
export function make_full_grid(sudoku: Sudoku) {
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            sudoku.grid[r][c] = new Cell(1, true)
        }
    }
}

// Example function
export function make_simple_solved_grid(sudoku: Sudoku) {
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
    num: number
    is_hint: boolean
    to_html: () => HTMLElement

    constructor(
        num: number,
        is_hint: boolean = false,
        to_html_fn = () => default_to_html(this)
    ) {
        this.num = num
        this.is_hint = is_hint

        this.to_html = to_html_fn
    }

    public is_collapsed(): boolean {
        return this.num != null
    }
}

function default_to_html(cell: Cell | null): HTMLElement {
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
