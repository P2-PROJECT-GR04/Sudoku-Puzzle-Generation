import { createNumpad } from './numpad.js'
import { draw_sudoku } from './draw_sudoku.js'
import { make_solved_grid, remove_cells, Sudoku } from './sudoku.js'
import { newSeed, Rng } from './rand.js'
import { state, updateState } from './state.js'

/// Load a new Sudoku from the original state
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

/// Create a new random Sudoku and update the state
function newSudoku() {
    state.seed = newSeed()
    state.rand = new Rng(state.seed)

    state.sudoku = new Sudoku(3, 3)
    make_solved_grid(state.sudoku, state.rand)

    createNumpad(state.sudoku)

    remove_cells(state.sudoku, state.rand)

    draw_sudoku(state.sudoku)
    updateState(state)
}

document
    .getElementById('gen-sudoku-button')
    .addEventListener('click', newSudoku)

loadSudoku(state)

export function mark_cell(sudoku, coord) {
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
}

export function set_cell(sudoku, r, c, num) {
    if (!sudoku.grid[r][c].is_hint) {
        console.log(`Setting (${r}, ${c}) to ${num}`)
        sudoku.grid[r][c].num = num
    }
    updateState(state)
}
