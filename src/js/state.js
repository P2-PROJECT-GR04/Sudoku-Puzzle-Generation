import { Rng } from './rand.js'
import { make_solved_grid, remove_cells, Sudoku, Cell } from './sudoku.js'

// Holds the state of the game.
// There should only ever be one State object at once.
// Please use the global `state` variable instead of creating a new one
export class State {
    constructor(sudoku, rand) {
        this.sudoku = sudoku
        this.seed = rand.seed
        this.rand = rand
    }
}

// This can be global, as it is only used to manipulate the global search bar
export let state = getState()

// Update the saved state in the URL
export function updateState(state) {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)

    if (state.seed != null && state.seed != 0) {
        urlParams.set('seed', state.seed)
    }

    if (state.sudoku != null) {
        let sudoku_state = encodeSudoku(state.sudoku)
        // URL's need to make sure there are no special characters.
        // So any special character needs to be converted to hex (e.g. %FF)
        let uri_encoded = encodeURI(sudoku_state)
        urlParams.set('state', uri_encoded)
    }

    // Only update the bar if the state has changed
    // urlParams.toString() is the url parameters, without the ?, while
    // queryString has the ?, so this adds a ? to check if they're equal
    if (`?${urlParams.toString()}` != queryString) {
        history.pushState(null, '', `?${urlParams.toString()}`)
    }
}

// Get the state from the URL bar. Optimally this should only be run once at startup
export function getState() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)

    let seed = urlParams.get('seed')
    if (seed == 0) {
        seed = null
    }
    if (seed != null) {
        seed = Number(seed)
    }

    let rand = new Rng(seed)

    let sudoku_state = urlParams.get('state')

    if (sudoku_state != null) {
        // Decode URL hex characters (e.g. %20) to normal characters before decoding the sudoku
        let uri_decoded = decodeURI(sudoku_state)
        sudoku_state = decodeSudoku(rand, uri_decoded)
    }

    return new State(sudoku_state, rand)
}

// Decode the sudoku from the encoded text state
function decodeSudoku(rand, text) {
    rand = new Rng(rand.seed)

    let width = Number(text[0])
    if (!Number.isInteger(width) || width == 0) return null

    if (text[1] != 'x') return null

    let height = Number(text[2])
    if (!Number.isInteger(height) || height == 0) return null

    text = text.slice(3) // Remove size data

    let nums = []

    let i = 0
    while (i < text.length) {
        let next = text[i]

        if (next == 0) {
            nums.push(new Cell(null))
            i++
            continue
        }
        // x amount of empty
        if (next == 'e') {
            i++
            let num_str = ''
            while (i < text.length && text[i] != 'e') {
                num_str += text[i]
                i++
            }
            i++
            for (let n = 0; n < Number(num_str); n++) {
                nums.push(new Cell(null))
            }
            continue
        }

        // Candidates
        if (next == 'c') {
            i++
            let candidates = []
            while (i < text.length && text[i] != 'c') {
                candidates.push(Number(text[i]))
                i++
            }
            i++
            let cell = new Cell(null)
            cell.candidates = candidates
            nums.push(cell)
            continue
        }

        // Normal number
        nums.push(new Cell(Number(text[i])))
        i++
    }

    let sudoku = new Sudoku(width, height)
    make_solved_grid(sudoku, rand)
    remove_cells(sudoku, rand)

    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].is_hint) continue

            let cell = nums.shift()
            if (cell == undefined) {
                cell = new Cell(null)
            }
            sudoku.grid[r][c] = cell
        }
    }

    return sudoku
}

/// Convert the Sudoku to an encoded text string for the URL
function encodeSudoku(sudoku) {
    let raw_str = ''
    raw_str += `${sudoku.region_width}x${sudoku.region_height}`

    let numbers = ''
    let empty_cells = 0

    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            let cell = sudoku.grid[r][c]

            if (cell.is_hint) continue

            if (cell.is_collapsed()) {
                if (empty_cells != 0) {
                    numbers += `e${empty_cells}e`
                    empty_cells = 0
                }
                numbers += `${cell.num}`
            } else {
                // numbers += '0'
                if (cell.candidates.length == 0) {
                    empty_cells += 1
                    continue
                }
                if (empty_cells != 0 && cell.candidates.length != 0) {
                    numbers += `e${empty_cells}e`
                    empty_cells = 0
                }
                numbers += 'c'
                cell.candidates.forEach(
                    (candidate) => (numbers += `${candidate}`)
                )
                numbers += 'c'
            }
        }
    }
    if (empty_cells != 0) {
        numbers += `e${empty_cells}e`
    }

    raw_str += numbers
    return raw_str
}
