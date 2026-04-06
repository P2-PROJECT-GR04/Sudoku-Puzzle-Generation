import { draw_sudoku } from './draw_sudoku.js'
import { make_solved_grid, Sudoku } from './sudoku.js'

let grid = new Sudoku(3, 3)
make_solved_grid(grid, /* seed, leave null for random */ null)
draw_sudoku(grid)

