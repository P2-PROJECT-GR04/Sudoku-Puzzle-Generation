import { createNumpad } from './numpad.js'
import { reapplyBlur, startTimer } from './timer_function.js'
import { draw_sudoku } from './draw_sudoku.js'
import { make_solved_grid, remove_cells, Sudoku } from './sudoku.js'
import { newSeed, Rng } from './rand.js'
import { initState, State, state, updateState } from './state.js'
import {
    pauseTimer,
    resumeTimer,
    resetTimer,
    updateTimerDisplayFromState,
    reapplyDisable,
    reapplyPauseButtons,
} from './timer_function.js'

initState()
/**
 * Load a new Sudoku from a state
 * @modifies {state}
 * @param {State} state - The state to use
 */
function loadSudoku(state) {
    if (state.seed == null) {
        state.seed = newSeed()
        console.warn(`No given seed. New seed is ${state.seed}`)
    }

    let rand = new Rng(state.seed)

    if (state.sudoku == null) {
        console.warn('No given state. Starting new board')
        state.sudoku = new Sudoku(3, 3)
        make_solved_grid(state.sudoku, rand)
        remove_cells(state.sudoku, rand)
    }

    createNumpad(state.sudoku)

    draw_sudoku(state.sudoku)
    updateState(state)
}

/**
 * Create a new random Sudoku and update the state
 * @modifies {state}
 */
function newSudoku() {
    state.seed = newSeed()
    state.rand = new Rng(state.seed)

    //Resets the timer when new sudokus are made.
    resetTimer()
    startTimer()

    state.sudoku = new Sudoku(3, 3)
    make_solved_grid(state.sudoku, state.rand)

    createNumpad(state.sudoku)

    remove_cells(state.sudoku, state.rand)

    draw_sudoku(state.sudoku)
    updateState(state)
    reapplyBlur()
}

document
    .getElementById('easy')
    .addEventListener('click', newSudoku)

document
    .getElementById('medium')
    .addEventListener('click', newSudoku)

document
    .getElementById('hard')
    .addEventListener('click', newSudoku)
    
loadSudoku(state)

if (!state.isPaused) {
    startTimer()
} else {
    updateTimerDisplayFromState()
    reapplyBlur()
    reapplyDisable()
    reapplyPauseButtons()
}

/**
 * Mark a cell in a sudoku
 * @modifies {sudoku}
 * @param {Sudoku} sudoku - The sudoku to modify
 * @param {number[]} coord - The coordinate for the cell to mark, given with [r,c]
 */
export function mark_cell(sudoku, coord) {
    if (state.isPaused) return

    if (sudoku.marked_cell != null)
        sudoku.mark_cell(sudoku.marked_cell[0], sudoku.marked_cell[1], false)
    // sudoku.grid[sudoku.marked_cell[0]][sudoku.marked_cell[1]].set_marked(false)

    if (
        //This checks first if coord is a not null, and then if the same cell has just been marked. Then it demarks it.
        !coord ||
        (sudoku.marked_cell &&
            sudoku.marked_cell[0] == coord[0] &&
            sudoku.marked_cell[1] == coord[1])
    ) {
        sudoku.mark_cell(sudoku.marked_cell[0], sudoku.marked_cell[1], false)
        sudoku.marked_cell = null
        draw_sudoku(sudoku)
        return
    }
    sudoku.marked_cell = coord
    if (sudoku.marked_cell != null)
        sudoku.mark_cell(sudoku.marked_cell[0], sudoku.marked_cell[1], true)

    console.debug(`MARKED: ${sudoku.marked_cell}`)

    draw_sudoku(sudoku)
    reapplyBlur()
}

/**
 * Give a value to a cell, and update the global state
 * @modifies {sudoku, state}
 * @param {Sudoku} sudoku - The sudoku to modify
 * @param {number} r - The row to set
 * @param {number} c - The column to set
 * @param {number | null} num - The new value of the cell
 */
export function set_cell(sudoku, r, c, num) {
    if (state.isPaused) return
    if (!sudoku.grid[r][c].is_hint) {
        console.log(`Setting (${r}, ${c}) to ${num}`)
        sudoku.grid[r][c].num = num
    }
    updateState(state)
}

const pauseBtn = document.getElementById('pauseBtn')
const resumeBtn = document.getElementById('resumeBtn')

pauseBtn.addEventListener('click', () => {
    pauseTimer()
    pauseBtn.style.display = 'none'
    resumeBtn.style.display = 'inline-block'
})

resumeBtn.addEventListener('click', () => {
    resumeTimer()
    resumeBtn.style.display = 'none'
    pauseBtn.style.display = 'inline-block'
})

document.addEventListener('keydown', (e) => {
    const sudoku = state.sudoku
    if (!sudoku || sudoku.marked_cell == null) return

    const [r, c] = sudoku.marked_cell
    const size = sudoku.size

    const moves = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
    }

    const delta = moves[e.key]
    if (!delta) return

    e.preventDefault()

    const newR = r + delta[0]
    const newC = c + delta[1]

    if (newR >= 0 && newR < size && newC >= 0 && newC < size) {
        mark_cell(sudoku, [newR, newC])
    }
})
