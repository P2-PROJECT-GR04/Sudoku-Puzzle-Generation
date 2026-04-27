import * as solvers from '../src/js/solvers.js'
import { find_candidates_for_grid } from '../src/js/check-hint.js'
import { sudoku_from_grid } from '../src/js/sudoku.js'

describe('Naked single', () => {
    test('Simple 9x9 naked single', () => {
        let grid = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, null, 6, 7, 8, 9, 1, 2, 3],
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
        find_candidates_for_grid(sudoku)

        let result = solvers.naked_single(sudoku)
        expect(result).toBe(true)

        expect(sudoku.grid[1][1].num).toBe(5)
    })
})

describe('Naked pair', () => {
    test('Simple 9x9 naked pair', () => {
        let grid = [
            [4, null, null, null, null, null, 9, 3, 8],
            [null, 3, 2, null, 9, 4, 1, null, null],
            [null, 9, 5, 3, null, null, 2, 4, null],
            [3, 7, null, 6, null, 9, null, null, 4],
            [5, 2, 9, null, null, 1, 6, 7, 3],
            [6, null, 4, 7, null, 3, null, 9, null],
            [9, 5, 7, null, null, 8, 3, null, null],
            [null, null, 3, 9, null, null, 4, null, null],
            [2, 4, null, null, 3, null, 7, null, 9],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)
        expect(sudoku).not.toBeNull()
        find_candidates_for_grid(sudoku)

        expect(sudoku.grid[0][4].candidates).toEqual([1, 2, 5, 6, 7])

        let result = solvers.naked_pair(sudoku)
        expect(result).toBe(true)

        expect(sudoku.grid[0][4].candidates).toEqual([2, 5, 7])
    })
})

describe('Hidden single', () => {
    test('Simple 9x9 Hidden single', () => {
        let grid = [
            [null, null, 9, null, 3, 2, null, null, null],
            [null, null, null, 7, null, null, null, null, null],
            [1, 6, 2, null, null, null, null, null, null],
            [null, 1, null, null, 2, null, 5, 6, null],
            [null, null, null, 9, null, null, null, null, null],
            [null, 5, null, null, null, null, 1, null, 7],
            [null, null, null, null, null, null, 4, null, 3],
            [null, 2, 6, null, null, 9, null, null, null],
            [null, null, 5, 8, 7, null, null, null, null],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)
        expect(sudoku).not.toBeNull()
        find_candidates_for_grid(sudoku)

        expect(sudoku.grid[6][2].candidates).toEqual(
            expect.arrayContaining([1])
        )

        let result = solvers.hidden_single(sudoku)
        expect(result).toBe(true)

        expect(sudoku.grid[6][2].num).toBe(1)
    })
})

describe('Hidden pair', () => {
    test('Simple 9x9 Hidden pair', () => {
        let grid = [
            [null, null, null, null, null, null, null, null, null],
            [9, null, 4, 6, null, 7, null, null, null],
            [null, 7, 6, 8, null, 4, 1, null, null],
            [3, null, 9, 7, null, 1, null, 8, null],
            [7, null, 8, null, null, null, 3, null, 1],
            [null, 5, 1, 3, null, 8, 7, null, 2],
            [null, null, 7, 5, null, 2, 6, 1, null],
            [null, null, 5, 4, null, 3, 2, null, 8],
            [null, null, null, null, null, null, null, null, null],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)
        expect(sudoku).not.toBeNull()
        find_candidates_for_grid(sudoku)

        expect(sudoku.grid[0][7].candidates).toEqual([2, 3, 4, 5, 6, 7, 9])

        let result = solvers.hidden_pair(sudoku)
        expect(result).toBe(true)

        expect(sudoku.grid[6][2].num).toBe(1)
    })
})

describe('X-Wing', () => {
    test('Simple 9x9 X-Wing', () => {
        let grid = [
            [1, null, null, null, null, null, 5, 6, 9],
            [4, 9, 2, null, 5, 6, 1, null, 8],
            [null, 5, 6, 1, null, 9, 2, 4, null],
            [null, null, 9, 6, 4, null, 8, null, 1],
            [null, 6, 4, null, 1, null, null, null, null],
            [2, 1, 8, null, 3, 5, 6, null, 4],
            [null, 4, null, 5, null, null, null, 1, 6],
            [9, null, 5, null, 6, 1, 4, null, 2],
            [6, 2, 1, null, null, null, null, null, 5],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)
        expect(sudoku).not.toBeNull()
        find_candidates_for_grid(sudoku)

        expect(sudoku.grid[0][3].candidates).toEqual([2, 3, 4, 7, 8])

        let result = solvers.x_wing(sudoku)
        expect(result).toBe(true)

        expect(sudoku.grid[0][3].candidates).toEqual([2, 3, 4, 8])
    })
})

describe('Y-Wing', () => {
    test('Simple 9x9 Y-Wing', () => {
        let grid = [
            [null, 3, 4, 5, 9, null, null, 8, 6],
            [8, null, 2, null, 6, 3, 4, 5, null],
            [6, null, 5, 4, null, 8, null, null, null],
            [null, null, 3, 9, 8, null, 5, 6, 4],
            [null, 5, 8, 6, 7, 4, null, 9, null],
            [9, 4, 6, null, null, 5, 8, null, null],
            [5, 2, 7, 3, 1, 6, 9, 4, 8],
            [3, 8, 1, 2, 4, 9, 6, 7, 5],
            [4, 6, 9, 8, 5, 7, 1, 2, 3],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)
        expect(sudoku).not.toBeNull()
        find_candidates_for_grid(sudoku)

        expect(sudoku.grid[4][6].candidates).toEqual([2, 3])

        expect(sudoku.grid[0][0].candidates).toEqual([1, 7])
        expect(sudoku.grid[4][0].candidates).toEqual([1, 2])
        expect(sudoku.grid[0][6].candidates).toEqual([2, 7])

        let result = solvers.y_wing(sudoku)
        expect(result).toBe(true)

        expect(sudoku.grid[4][6].candidates).toEqual([3])
    })
})

describe('Swordfish', () => {
    test('Simple 9x9 Swordfish', () => {
        let grid = [
            [5, 2, 9, 4, 1, null, 7, null, 3],
            [null, null, 6, null, null, 3, null, null, 2],
            [null, null, 3, 2, null, null, null, null, null],
            [null, 5, 2, 3, null, null, null, 7, 6],
            [6, 3, 7, null, 5, null, 2, null, null],
            [1, 9, null, 6, 2, 7, 5, 3, null],
            [3, null, null, null, 6, 9, 4, 2, null],
            [2, null, null, 8, 3, null, 6, null, null],
            [9, 6, null, 7, 4, 2, 3, null, 5],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)
        expect(sudoku).not.toBeNull()
        find_candidates_for_grid(sudoku)

        expect(sudoku.grid[1][1].candidates).toEqual([1, 4, 7, 8])

        let result = solvers.swordfish(sudoku)
        expect(result).toBe(true)

        expect(sudoku.grid[1][1].candidates).toEqual([1, 4, 7])
    })
})
