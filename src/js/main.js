import { generateSimpleSolvedSudoku } from "./simple-solved-grid.js";

export let EmptySudokuGrid = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
]

generateSimpleSolvedSudoku(EmptySudokuGrid);


for (let i = 0; i < EmptySudokuGrid.length; i++) {
    console.log(EmptySudokuGrid[i]);
}