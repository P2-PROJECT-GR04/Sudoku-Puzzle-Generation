import * as solvers from '../src/js/solvers.js'
import { find_candidates_for_grid } from '../src/js/check-hint.js'
import { sudoku_from_grid } from '../src/js/sudoku.js'

describe('Naked single', () => {
    test('Simple 9x9 naked single', () => {
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
        find_candidates_for_grid(sudoku)

        let result = solvers.naked_single(sudoku)
        expect(result).toBe(true)

        expect(sudoku.grid[1][1].num).toBe(5)
    })

    test('Harder 9x9 naked single', () => {
        let grid = [
            [0, 6, 2, 3, 5, 8, 0, 9, 0],
            [1, 3, 5, 0, 0, 7, 0, 0, 0],
            [0, 8, 7, 0, 2, 1, 3, 5, 6],
            [8, 0, 0, 7, 4, 0, 0, 0, 0],
            [7, 4, 3, 5, 1, 6, 0, 0, 0],
            [2, 5, 0, 0, 0, 3, 0, 0, 1],
            [5, 7, 0, 0, 0, 9, 8, 0, 2],
            [0, 2, 4, 1, 0, 5, 7, 0, 0],
            [0, 0, 0, 2, 0, 0, 0, 0, 5],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)
        expect(sudoku).not.toBeNull()
        find_candidates_for_grid(sudoku)

        let result = solvers.naked_single(sudoku)
        expect(result).toBe(true)

        expect(sudoku.grid[0][0].num).toBe(4)
    })
})

describe('Naked pair', () => {
    test('Simple 9x9 naked pair', () => {
        let grid = [
            [4, 0, 0, 0, 0, 0, 9, 3, 8],
            [0, 3, 2, 0, 9, 4, 1, 0, 0],
            [0, 9, 5, 3, 0, 0, 2, 4, 0],
            [3, 7, 0, 6, 0, 9, 0, 0, 4],
            [5, 2, 9, 0, 0, 1, 6, 7, 3],
            [6, 0, 4, 7, 0, 3, 0, 9, 0],
            [9, 5, 7, 0, 0, 8, 3, 0, 0],
            [0, 0, 3, 9, 0, 0, 4, 0, 0],
            [2, 4, 0, 0, 3, 0, 7, 0, 9],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)
        expect(sudoku).not.toBeNull()
        find_candidates_for_grid(sudoku)

        expect(sudoku.grid[0][4].candidates).toEqual([1, 2, 5, 6, 7])

        let first_result = solvers.naked_pair(sudoku)
        expect(first_result).toBe(true)

        expect(sudoku.grid[0][4].candidates).toEqual([2, 5, 7])

        expect(sudoku.grid[7][0].candidates).toEqual([1, 8])

        let second_result = solvers.naked_pair(sudoku)
        expect(second_result).toBe(true)

        expect(sudoku.grid[7][0].candidates).toEqual([1])
    })
})

describe('Hidden single', () => {
    test('Simple 9x9 Hidden single', () => {
        let grid = [
            [0, 0, 9, 0, 3, 2, 0, 0, 0],
            [0, 0, 0, 7, 0, 0, 0, 0, 0],
            [1, 6, 2, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 2, 0, 5, 6, 0],
            [0, 0, 0, 9, 0, 0, 0, 0, 0],
            [0, 5, 0, 0, 0, 0, 1, 0, 7],
            [0, 0, 0, 0, 0, 0, 4, 0, 3],
            [0, 2, 6, 0, 0, 9, 0, 0, 0],
            [0, 0, 5, 8, 7, 0, 0, 0, 0],
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
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [9, 0, 4, 6, 0, 7, 0, 0, 0],
            [0, 7, 6, 8, 0, 4, 1, 0, 0],
            [3, 0, 9, 7, 0, 1, 0, 8, 0],
            [7, 0, 8, 0, 0, 0, 3, 0, 1],
            [0, 5, 1, 3, 0, 8, 7, 0, 2],
            [0, 0, 7, 5, 0, 2, 6, 1, 0],
            [0, 0, 5, 4, 0, 3, 2, 0, 8],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)
        expect(sudoku).not.toBeNull()
        find_candidates_for_grid(sudoku)

        expect(sudoku.grid[0][7].candidates).toEqual([2, 3, 4, 5, 6, 7, 9])

        let result = solvers.hidden_pair(sudoku)
        expect(result).toBe(true)

        expect(sudoku.grid[0][7].candidates).toEqual([6,7])
    })
})

describe('X-Wing', () => {
    test('Simple 9x9 X-Wing', () => {
        let grid = [
            [1, 0, 0, 0, 0, 0, 5, 6, 9],
            [4, 9, 2, 0, 5, 6, 1, 0, 8],
            [0, 5, 6, 1, 0, 9, 2, 4, 0],
            [0, 0, 9, 6, 4, 0, 8, 0, 1],
            [0, 6, 4, 0, 1, 0, 0, 0, 0],
            [2, 1, 8, 0, 3, 5, 6, 0, 4],
            [0, 4, 0, 5, 0, 0, 0, 1, 6],
            [9, 0, 5, 0, 6, 1, 4, 0, 2],
            [6, 2, 1, 0, 0, 0, 0, 0, 5],
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
            [0, 3, 4, 5, 9, 0, 0, 8, 6],
            [8, 0, 2, 0, 6, 3, 4, 5, 0],
            [6, 0, 5, 4, 0, 8, 0, 0, 0],
            [0, 0, 3, 9, 8, 0, 5, 6, 4],
            [0, 5, 8, 6, 7, 4, 0, 9, 0],
            [9, 4, 6, 0, 0, 5, 8, 0, 0],
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
            [5, 2, 9, 4, 1, 0, 7, 0, 3],
            [0, 0, 6, 0, 0, 3, 0, 0, 2],
            [0, 0, 3, 2, 0, 0, 0, 0, 0],
            [0, 5, 2, 3, 0, 0, 0, 7, 6],
            [6, 3, 7, 0, 5, 0, 2, 0, 0],
            [1, 9, 0, 6, 2, 7, 5, 3, 0],
            [3, 0, 0, 0, 6, 9, 4, 2, 0],
            [2, 0, 0, 8, 3, 0, 6, 0, 0],
            [9, 6, 0, 7, 4, 2, 3, 0, 5],
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
