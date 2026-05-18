import { grid_from_sudoku, Sudoku, sudoku_from_grid } from '../src/js/sudoku.js'

describe('Sudoku Class', () => {
    test('should generate a new Sudoku with the correct size 9x9', () => {
        const width = 3
        const height = 3

        const game = new Sudoku(width, height)

        expect(game).toBeInstanceOf(Sudoku)
        expect(game.grid.length).toBe(9)
        expect(game).toBeDefined()
    })

    test('transpose', () => {
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

        let transposed_grid = [
            [1, 4, 7, 2, 5, 8, 3, 6, 9],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [3, 6, 9, 4, 7, 1, 5, 8, 2],
            [4, 7, 1, 5, 8, 2, 6, 9, 3],
            [5, 8, 2, 6, 9, 3, 7, 1, 4],
            [6, 9, 3, 7, 1, 4, 8, 2, 5],
            [7, 1, 4, 8, 2, 5, 9, 3, 6],
            [8, 2, 5, 9, 3, 6, 1, 4, 7],
            [9, 3, 6, 1, 4, 7, 2, 5, 8],
        ]

        let sudoku = sudoku_from_grid(3, 3, grid)

        sudoku.transpose()

        expect(grid_from_sudoku(sudoku)).toEqual(transposed_grid)
    })
})
