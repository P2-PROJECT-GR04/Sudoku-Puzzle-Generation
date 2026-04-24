const { State } = require('../src/js/state.js')
const { Sudoku } = require('../src/js/sudoku.js')
const { Rng } = require('../src/js/rand.js')

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

describe('State Class', () => {
    test('should correctly hold a Sudoku instance and seed', () => {
        const game = new Sudoku(3, 3)
        const seed = 12345
        const rand = new Rng(seed)

        const gameState = new State(game, rand)

        expect(gameState).toBeInstanceOf(State)
        expect(gameState.sudoku).toBeInstanceOf(Sudoku)
        expect(gameState.seed).toBe(seed)

        expect(gameState.sudoku.size).toBe(9)
    })
})
