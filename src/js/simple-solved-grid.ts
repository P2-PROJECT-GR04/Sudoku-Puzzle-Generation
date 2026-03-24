//import { EmptySudokuGrid } from "./main.js";

import { Sudoku } from './sudoku'

export function generateSimpleSolvedSudoku(EmptySudokuGrid: Sudoku) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            EmptySudokuGrid[r][c] =
                ((3 * (r % 3) + Math.floor(r / 3) + c) % 9) + 1
            //Simple mathematical formula for creating a solved Sudoku grid
        }
    }
}
