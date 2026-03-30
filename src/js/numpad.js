import { draw_sudoku } from './draw_sudoku.js'
import { mark_cell, set_cell, marked_cell } from './script.js'
import { sudoku } from './script.js'
import { check_board } from './sudoku.js'
import { show_hint } from './check-hint.js'

export function createNumpad(size) {
    const display = document.getElementById('sudoku-numpad-display')
    const numpad = document.getElementById('sudoku-numpad')
    const numpadColumn = 3
    const keys = []
    let currentRow = [] //This is used to insert paired elements in numpad keys array

    for (let i = 1; i <= size; i++) {
        currentRow.push(i.toString())
        if (currentRow.length === numpadColumn) {
            keys.push(currentRow)
            currentRow = [] //Resets the currentRow for each Column it creates
        }
    }
    if (currentRow.length > 0) keys.push(currentRow)
    currentRow = ['DEL', 'Show hint', 'Check board'] //Creates the DEL and Show Hint buttons
    keys.push(currentRow)
    console.log(keys)

    keys.forEach((row) => {
        const tr = document.createElement('tr')
        row.forEach((key) => {
            const td = document.createElement('td')
            const btn = document.createElement('button')
            btn.className = 'numpad-cell'
            btn.textContent = key
            if (key === 'DEL') {
                //td.colSpan = numpadColumn
                btn.classList.add('del-btn')
            }
            if (key === 'Show hint') {
                //td.colSpan = numpadColumn
                btn.classList.add('show-hint-btn')
            }
            if (key === 'Check board') {
                td.colSpan = numpadColumn
                btn.classList.add('check-board-btn')
            }
            td.appendChild(btn)
            tr.appendChild(td)
        })
        numpad.appendChild(tr)
    })

    numpad.onclick = (event) => {
        if (event.target.tagName !== 'BUTTON') return
        const numpadValue = event.target.textContent
        if (
            marked_cell != null &&
            numpadValue !== 'Check board' &&
            numpadValue !== 'Show hint'
        ) {
            let cell = marked_cell
            mark_cell(null)
            if (numpadValue === 'DEL') {
                set_cell(cell[0], cell[1], null)
            } else {
                set_cell(cell[0], cell[1], numpadValue)
            }
        }
        if (numpadValue == 'Check board') {
            console.log('Checking board')
            check_board(sudoku)
        }
        if (numpadValue == 'Show hint') {
            console.log('Show hints')
            show_hint(sudoku)
        }
        draw_sudoku(sudoku)
    }
}
