import { draw_sudoku } from './draw_sudoku'
import { make_simple_solved_grid, Sudoku } from './sudoku'

let grid = new Sudoku(3, 3)
console.log(`W: ${grid.region_width} x H: ${grid.region_height}`)
make_simple_solved_grid(grid)
draw_sudoku(grid)
