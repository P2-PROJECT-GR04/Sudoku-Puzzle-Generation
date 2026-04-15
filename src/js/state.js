import { Rng } from './rand.js'
import { make_solved_grid, remove_cells, Sudoku } from './sudoku.js'
import { Cell } from './cell.js'

/**
 * Holds the state of the game.
 * There should only ever be one State object at once.
 * Please use the global `state` variable instead of creating a new one
 * @class
 * @property {Sudoku | null} sudoku - The current Sudoku board
 * @property {number | null} seed - The seed of the current game
 * @property {Rng} - The random number generator made from the current seed
 */
export class State {
    constructor(sudoku, rand, time, isPaused) {
        this.sudoku = sudoku
        this.seed = rand.seed
        this.rand = rand
        this.time = time
        this.isPaused = isPaused
    }
}

/**
 * The global state.
 * This can be global, as it is only used to manipulate the global search bar
 * @type {State}
 */
export let state = null

export function initState() {
    state = getState()
}

/**
 * Save the current state
 * @modifies {history}
 * @param {State} state
 */
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

    // Save time
    if (state.time != null) {
        urlParams.set('t', Math.round(state.time / 1000))
    }

    // Saves pause state
    urlParams.set('p', state.isPaused ? '1' : '0')

    // Only update the bar if the state has changed
    // urlParams.toString() is the url parameters, without the ?, while
    // queryString has the ?, so this adds a ? to check if they're equal
    if (`?${urlParams.toString()}` != queryString) {
        history.pushState(null, '', `?${urlParams.toString()}`)
    }
}

/**
 * Get the saved state. Optimally this should only be run once at startup
 * @returns {State} The state
 */
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

    // Restores the timer time
    let time_secs = Number(urlParams.get('t')) || 0
    let time = time_secs * 1000

    // Restores the pause state
    let isPaused = urlParams.get('p') === '1'

    return new State(sudoku_state, rand, time, isPaused)
}

/**
 * Decode the sudoku from the encoded text state
 * @param {Rng} rand - The random number generator to use
 * @param {string} text - The encoded sudoku
 * @returns {Sudoku|null} The decoded sudoku, or null on error
 */
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

/**
 * Convert the Sudoku to an encoded text string
 * @param {Sudoku} sudoku - The Sudoku to encode
 * @returns {string} The encoded text string
 */
function encodeSudoku(sudoku) {
    let encoded = ''
    encoded += `${sudoku.region_width}x${sudoku.region_height}`

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

    encoded += numbers
    return encoded
}
