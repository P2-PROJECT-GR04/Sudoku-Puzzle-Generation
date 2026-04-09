import { draw_sudoku } from './draw_sudoku.js'
import { sudoku } from './script.js'
import {
    find_candidates_for_grid,
    find_candidates_for_cell,
} from './check-hint.js'

export function has_one_solution(sudoku) {
    let trace = []
    let found_solution = false
    while (!full_grid(sudoku) || trace.length != 0) {
        let cell = lowest_candidates(sudoku)
        if (cell.candidates.length == 0) {
            sudoku = trace.pop()
        } else if (cell.candidates.length == 1) {
            sudoku.grid[cell.r][cell.c].num =
                sudoku.grid[cell.r][cell.c].candidates.pop()
        } else {
            let candidate = pop(cell.candidates)
            trace.push({ ...sudoku })
            cell = candidate
        }
    }
}

function full_grid(sudoku) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (sudoku.grid[r][c].num == null) {
                return false
            }
        }
    }
    return true
}

function lowest_candidates(sudoku) {
    let currentLowest = {
        r: null,
        c: null,
        candidates: null,
    }
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].is_collapsed() == true) {
                continue
            }
            let candidates_for_cell = find_candidates_for_cell(sudoku, r, c)
            if (
                currentLowest.candidates == null ||
                currentLowest.candidates.length > candidates_for_cell.length
            ) {
                currentLowest.r = r
                currentLowest.c = c
                currentLowest.candidates = candidates_for_cell
            }
        }
    }
    return currentLowest
}
