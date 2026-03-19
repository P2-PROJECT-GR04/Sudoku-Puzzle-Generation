import { draw_sudoku } from './draw_sudoku.js'
import { make_full_grid, make_simple_solved_grid, Sudoku } from './sudoku.js'


let grid = new Sudoku(3, 3)
make_simple_solved_grid(grid)
draw_sudoku(grid)