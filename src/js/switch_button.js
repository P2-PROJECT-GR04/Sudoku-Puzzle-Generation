import { state, updateState } from './state.js'
import { draw_sudoku } from './draw_sudoku.js'

let notesMode = false

function createSwitchButton() {
    const button = document.createElement('button')
    button.id = 'notes-mode-btn'
    button.textContent = 'Notes Mode: OFF'

    function toggle() {
        notesMode = !notesMode
        button.textContent = `Notes Mode: ${notesMode ? 'ON' : 'OFF'}`
        button.classList.toggle('notes-active', notesMode)
    }

    button.addEventListener('click', toggle)

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            event.preventDefault()
            toggle()
        }
    })

    const wrapper = document.getElementById('wrapper')
    wrapper.parentNode.insertBefore(button, wrapper)
}

function toggleCandidate(cell, num) {
    if (cell.candidates.includes(num)) {
        cell.candidates = cell.candidates.filter(n => n !== num)
    } else {
        cell.num = null
        cell.candidates.push(num)
        cell.candidates.sort((a, b) => a - b)
    }
}

document.addEventListener('keydown', (event) => {
    if (!notesMode) return
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
}, true)

document.addEventListener('click', (event) => {
    if (!notes_mode) return
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
}, true)

const style = document.createElement('style')
style.textContent = `
    #notes-mode-btn {
        display: block;
        margin: 10px auto;
        padding: 10px 24px;
        font-size: 1em;
        cursor: pointer;
        background: #ddd;
        border: 2px solid #999;
        border-radius: 6px;
        transition: background 0.2s, color 0.2s;
    }
    #notes-mode-btn.notes-active {
        background: #4CAF50;
        color: white;
        border-color: #2e7d32;
    }
`
document.head.appendChild(style)

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSwitchButton)
} else {
    createSwitchButton()
}
