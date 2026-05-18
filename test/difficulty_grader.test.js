import { grade } from '../src/js/difficulty_grader.js'
import { sudoku_from_grid } from '../src/js/sudoku.js'

describe('Normal Techniques', () => {
    test('1 Naked Single', () => {
        let grid = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 0, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)
        expect(sudoku).not.toBeNull()
        let score = grade(sudoku)

        expect(score).toBe(0.05)
    })
    test('9 Naked Singles', () => {
        let grid = [
            [1, 0, 3, 4, 5, 6, 7, 8, 9],
            [4, 0, 6, 7, 8, 9, 1, 2, 3],
            [7, 0, 9, 1, 2, 3, 4, 5, 6],
            [2, 0, 4, 5, 6, 7, 8, 9, 1],
            [5, 0, 7, 8, 9, 1, 2, 3, 4],
            [8, 0, 1, 2, 3, 4, 5, 6, 7],
            [3, 0, 5, 6, 7, 8, 9, 1, 2],
            [6, 0, 8, 9, 1, 2, 3, 4, 5],
            [9, 0, 2, 3, 4, 5, 6, 7, 8],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)
        expect(sudoku).not.toBeNull()
        let score = grade(sudoku)

        expect(score).toBe(0.45)
    })
})

describe('Negative tests', () => {
    test('No Solution', () => {
        let grid = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 0, 6, 7, 8, 9, 1, 2, 3],
            [7, 5, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)
        expect(sudoku).not.toBeNull()
        let score = grade(sudoku)

        expect(score).toBe(-1)
    })
})
