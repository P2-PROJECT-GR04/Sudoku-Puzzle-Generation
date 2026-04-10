import { createNumpad } from './numpad.js'
import { draw_sudoku } from './draw_sudoku.js'
import { make_solved_grid, Sudoku } from './sudoku.js'
import { Rng } from './rand.js'

const queryString = window.location.search
console.log(`PARAMS: ${queryString}`)
const urlParams = new URLSearchParams(queryString)

let seed = Number(urlParams.get('seed'))
console.log(`SEED: ${seed}`)
let rand = new Rng(seed)

export let sudoku = new Sudoku(3, 3)

createNumpad(sudoku.size)

make_solved_grid(sudoku, rand)
/*
for (let i = 0; i < 50; i++) {
    let r = rand.nextRange(0, sudoku.size)
    let c = rand.nextRange(0, sudoku.size)
    sudoku.grid[r][c].is_hint = false
}*/

for (let r = 5; r < sudoku.size; r++) {
    for (let c = 0; c < sudoku.size; c++) {
        sudoku.grid[r][c].is_hint = false
        sudoku.grid[r][c].num = null
    }
}

draw_sudoku(sudoku)

// TODO: Make this a field of Sudoku, and make it all work without global variables.
export let marked_cell = null

export function mark_cell(coord) {
    if (marked_cell != null)
        sudoku.mark_cell(marked_cell[0], marked_cell[1], false)
    // sudoku.grid[marked_cell[0]][marked_cell[1]].set_marked(false)

    if (
        //This checks first if coord is a not null, and then if the same cell has just been marked. Then it demarks it.
        !coord ||
        (marked_cell &&
            marked_cell[0] == coord[0] &&
            marked_cell[1] == coord[1])
    ) {
        sudoku.mark_cell(marked_cell[0], marked_cell[1], false)
        marked_cell = null
        draw_sudoku(sudoku)
        return
    }
    marked_cell = coord
    if (marked_cell != null)
        sudoku.mark_cell(marked_cell[0], marked_cell[1], true)

    console.debug(`MARKED: ${marked_cell}`)

    draw_sudoku(sudoku)
}

document.addEventListener('keydown', function (event) {
    console.log(`GOT INPUT: ${event.key}`)
    if (marked_cell != null) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
            let cell = marked_cell
            mark_cell(null)
            set_cell(cell[0], cell[1], null)
        } else {
            let num = Number.parseInt(event.key)
            if (isNaN(num) || num == 0 || num > sudoku.size) return

            let cell = marked_cell
            mark_cell(null)
            set_cell(cell[0], cell[1], event.key)
        }
    }
    draw_sudoku(sudoku)
})

export function set_cell(r, c, num) {
    if (!sudoku.grid[r][c].is_hint) {
        console.log(`Setting (${r}, ${c}) to ${num}`)
        sudoku.grid[r][c].num = num
    }
}
