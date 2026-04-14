/**
 * A cell from a Sudoku.
 * This can be a number or a collection of candidates.
 * @class
 * @property {number | null} num - The number of the cell. Is null if it has not been collapsed
 * @property {boolean} is_hint - Holds if the number is a generated hint, or user input
 * @property {[]number} candidates - Holds the amount of candidates the cell has
 * @property {boolean} is_marked - Holds if the cell has been marked by the user
 * @property {boolean} is_assoc_marked - Holds if the cell has been marked by association (e.g. if it holds the same number as the marked cell)
 * @property {(is_marked: bool) => void} set_marked - Mark the cell
 * @property {() => HTMLElement} to_html - Convert the cell to a HTML representation for rendering
 */
export class Cell {
    /**
     * Constructs a new cell
     * @constructor
     * @param {number} num - The number that the Cell should hold. Set to null for it to be empty
     * @param {boolean} [is_hint=false] - If this cell is a hint or not
     * @param {() => HTMLElement} [to_html_fn=() => default_to_html(this)] - The function that the cell should use for HTML conversion
     * @param {number[]} [candidates=[]] - The candidates that the Cell should have
     */
    constructor(
        num,
        is_hint = false,
        to_html_fn = () => default_to_html(this),
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

        /** @readonly */
        this.set_marked = (is_marked) => (this.is_marked = is_marked)

        /** @readonly */
        this.to_html = to_html_fn
    }
}

/**
 * The default function for converting Cells to HTML
 * @param {Cell} cell - The cell to render
 */
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
