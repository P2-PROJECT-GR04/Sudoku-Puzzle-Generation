import { state, updateState } from './state.js'
import { draw_sudoku } from './draw_sudoku.js'

let noteMode = false

function createSwitchButton() {
    const button = document.createElement('button')
    button.classList.add('interactable-btn')
    button.id = 'notes-mode-btn'
    button.textContent = 'Notes Mode: OFF'

    function toggle() {
        noteMode = !noteMode
        button.textContent = `Notes Mode: ${noteMode ? 'ON' : 'OFF'}`
        button.classList.toggle('notes-active', noteMode)
    }

    button.addEventListener('click', toggle)

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            event.preventDefault()
            toggle()
        }
    })

    const wrapper = document.getElementById('numpad-wrap')
    wrapper.prepend(button)
}

function toggleCandidate(cell, num) {
    if (cell.candidates.includes(num)) {
        cell.candidates = cell.candidates.filter((n) => n !== num)
    } else {
        cell.num = null
        cell.candidates.push(num)
        cell.candidates.sort((a, b) => a - b)
    }
}

document.addEventListener(
    'keydown',
    (event) => {
        if (!noteMode) return
        if (!state.sudoku || !state.sudoku.marked_cell) return

        const [r, c] = state.sudoku.marked_cell
        const cell = state.sudoku.grid[r][c]
        if (cell.is_hint) return

        if (event.key === 'Delete' || event.key === 'Backspace') {
            event.stopImmediatePropagation()
            cell.candidates = []
            draw_sudoku(state.sudoku)
            updateState(state)
            return
        }

        const num = Number.parseInt(event.key)
        if (isNaN(num) || num < 1 || num > state.sudoku.size) return

        event.stopImmediatePropagation()
        toggleCandidate(cell, num)
        draw_sudoku(state.sudoku)
        updateState(state)
    },
    true
)

document.addEventListener(
    'click',
    (event) => {
        if (!noteMode) return
        if (!event.target.closest('#sudoku-numpad')) return
        if (event.target.tagName !== 'BUTTON') return
        if (!state.sudoku || !state.sudoku.marked_cell) return

        const value = event.target.textContent

        if (value === 'Check board' || value === 'Show hint') return

        const [r, c] = state.sudoku.marked_cell
        const cell = state.sudoku.grid[r][c]
        if (cell.is_hint) return

        event.stopImmediatePropagation()

        if (value === 'DEL') {
            cell.candidates = []
            cell.num = null
        } else {
            const num = Number.parseInt(value)
            if (!isNaN(num) && num >= 1 && num <= state.sudoku.size) {
                toggleCandidate(cell, num)
            }
        }

        draw_sudoku(state.sudoku)
        updateState(state)
    },
    true
)

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSwitchButton)
} else {
    createSwitchButton()
}
