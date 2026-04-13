// We get the functions from the files:
const script = require('../src/js/script.js')
const sudokuFile = require('../src/js/sudoku.js')
const checkBoard = require('../src/js/sudoku.js')
const draw = require('../src/js/draw_sudoku.js')
const checkHint = require('../src/js/check-hint.js')

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
// For testing show-hint function being called
jest.mock('../src/js/check-hint.js', () => ({
    show_hint: jest.fn(),
}))

// The numpad function gets initialized
const { createNumpad } = require('../src/js/numpad.js')

describe('createNumpad testing', () => {
    let sudokuMock

    beforeEach(() => {
        document.body.innerHTML = '<table id="sudoku-numpad"></table>'

        sudokuMock = {
            size: 9,
            marked_cell: [0, 0],
        }
    })

    test('should call set_cell with "1" when button 1 is clicked', () => {
        //creates a Numpad with the sudokuMock object for testing
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

        // Check if the correct function has been called
        expect(script.set_cell).toHaveBeenCalledWith(sudokuMock, 0, 0, '1')
    })

    test('should call show-hint when "Show hint" when  button show hint is clicked', () => {
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

        // Check if the correct function has been called
        expect(checkHint.show_hint).toHaveBeenCalledWith(sudokuMock)

        expect(checkHint.show_hint).toHaveBeenCalledTimes(1)
    })

    test('should call check_board function, when button "Check board" is clicked', () => {
        createNumpad(sudokuMock)

        const buttons = document.querySelectorAll('.numpad-cell')
        const button1 = Array.from(buttons).find(
            (btn) => btn.textContent === 'Check board'
        )
        if (button1) {
            button1.click()
        } else {
            throw new Error("Could not find the button 'Check board'")
        }

        // Check if the correct function has been called
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
        // Check if the correct function has been called
        expect(script.set_cell).toHaveBeenCalledWith(sudokuMock, 0, 0, null)
    })

    test('should have atleast 12 buttons in the numpad', () => {
        createNumpad(sudokuMock)
        const buttons = document.querySelectorAll('.numpad-cell')
        expect(buttons.length).toBeGreaterThanOrEqual(12)
    })
})
