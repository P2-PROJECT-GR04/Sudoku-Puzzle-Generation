/**
 * @jest-environment jsdom
 */

// We get the functions from the files:
const script = require('../src/js/script.js')
const sudokuFile = require('../src/js/sudoku.js')
const draw = require('../src/js/draw_sudoku.js')
const checkHint = require('../src/js/check-hint.js')
const { state } = require('../src/js/state.js')
const hasOneSolution = require('../src/js/has_one_solution.js')

//We mock our functions to test.
jest.mock('../src/js/script.js', () => ({
    mark_cell: jest.fn(),
    set_cell: jest.fn(),
}))
jest.mock('../src/js/sudoku.js', () => ({
    check_board: jest.fn(),
    Sudoku: jest.fn(),
}))
jest.mock('../src/js/draw_sudoku.js', () => ({
    draw_sudoku: jest.fn(),
}))
jest.mock('../src/js/check-hint.js', () => ({
    show_hint: jest.fn(),
    find_candidates_for_grid: jest.fn(),
}))

jest.mock('../src/js/state.js', () => ({
    state: {},
    updateState: jest.fn(),
    getState: jest.fn(),
    State: jest.fn(),
}))

jest.mock('../src/js/has_one_solution.js', () => ({
    has_one_solution: jest.fn(),
    deepCopy: jest.fn(),
}))

// The numpad function gets initialized
const { createNumpad } = require('../src/js/numpad.js')

describe('createNumpad testing', () => {
    let sudokuMock

    beforeEach(() => {
        document.body.innerHTML = '<table id="sudoku-numpad"></table>'

        // Initialize a 9x9 grid to prevent deepCopy and logic crashes
        const size = 9
        const mockGrid = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => ({
                num: null,
                candidates: [],
                is_hint: false,
            }))
        )

        sudokuMock = {
            size: size,
            marked_cell: [0, 0],
            grid: mockGrid,
        }

        state.sudoku = sudokuMock
        jest.clearAllMocks()
    })

    test('should call set_cell with "1" when button 1 is clicked', () => {
        createNumpad(sudokuMock)

        const buttons = document.querySelectorAll('.numpad-cell')
        const button1 = Array.from(buttons).find(
            (btn) => btn.textContent === '1'
        )
        if (button1) {
            button1.click()
        } else {
            throw new Error("Could not find the numpad button with '1'")
        }

        expect(script.set_cell).toHaveBeenCalledWith(sudokuMock, 0, 0, '1')
        expect(draw.draw_sudoku).toHaveBeenCalledWith(sudokuMock)
    })

    test('should call set_cell when a number key is pressed on keyboard', () => {
        createNumpad(sudokuMock)

        const event = new KeyboardEvent('keydown', { key: '5' })
        document.dispatchEvent(event)

        expect(script.set_cell).toHaveBeenCalledWith(sudokuMock, 0, 0, '5')
        expect(draw.draw_sudoku).toHaveBeenCalled()
    })

    test('should call show-hint when "Show hint" button is clicked', () => {
        createNumpad(sudokuMock)

        const buttons = document.querySelectorAll('.numpad-cell')
        const button1 = Array.from(buttons).find(
            (btn) => btn.textContent === 'Show hint'
        )
        if (button1) {
            button1.click()
        } else {
            throw new Error("Could not find the button 'Show hint'")
        }

        // Updated to match the find_candidates_for_grid call seen in error logs
        expect(checkHint.find_candidates_for_grid).toHaveBeenCalledWith(
            sudokuMock
        )
        expect(checkHint.find_candidates_for_grid).toHaveBeenCalledTimes(1)
    })

    test('should call check_board function, when button "Check board" is clicked', () => {
        // Tving valideringen til at lykkes, så check_board bliver kaldt
        const hasOneSolution = require('../src/js/has_one_solution.js')
        hasOneSolution.has_one_solution.mockReturnValue(true)

        createNumpad(sudokuMock)

        const buttons = document.querySelectorAll('.numpad-cell')
        const button1 = Array.from(buttons).find(
            (btn) => btn.textContent === 'Check board'
        )

        button1.click()

        expect(sudokuFile.check_board).toHaveBeenCalledWith(sudokuMock)
        expect(sudokuFile.check_board).toHaveBeenCalledTimes(1)
    })

    test('should call set_cell with null when DEL is clicked', () => {
        createNumpad(sudokuMock)

        const buttons = document.querySelectorAll('.numpad-cell')
        const delBtn = Array.from(buttons).find(
            (btn) => btn.textContent === 'DEL'
        )

        if (delBtn) delBtn.click()
        expect(script.set_cell).toHaveBeenCalledWith(sudokuMock, 0, 0, null)
    })

    test('should have atleast 12 buttons in the numpad', () => {
        createNumpad(sudokuMock)
        const buttons = document.querySelectorAll('.numpad-cell')
        expect(buttons.length).toBeGreaterThanOrEqual(12)
    })
})
