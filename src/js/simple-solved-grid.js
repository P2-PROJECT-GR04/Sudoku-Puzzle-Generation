import { EmptySudokuGrid } from "./main.js";


export function generateSimpleSolvedSudoku() {
    for (let r = 0; r < 9; r++){
        for (let c = 0; c < 9; c++){
            EmptySudokuGrid[r][c] = (3 * ( r % 3) + Math.floor(r / 3) + c) % 9 + 1;
        }
    }
    for (let i = 0; i < EmptySudokuGrid.length; i++) {
    console.log(EmptySudokuGrid[i]);
    }
}
