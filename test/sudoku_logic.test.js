const { Sudoku } = require('../src/js/sudoku.js')

describe('Sudoku Class', () => {
    test('should generate a new Sudoku with the correct size 9x9', () => {
        const width = 3
        const height = 3

        const game = new Sudoku(width, height)

        expect(game).toBeInstanceOf(Sudoku)
        expect(game.grid.length).toBe(9)
        expect(game).toBeDefined()
    })
})
