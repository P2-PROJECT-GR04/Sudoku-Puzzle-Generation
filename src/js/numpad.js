import { draw_sudoku } from './draw_sudoku.js'
import { mark_cell, set_cell, marked_cell } from './script.js'
import { sudoku } from './script.js'

export function createNumpad(size) {
    const display = document.getElementById('sudoku-numpad-display')
    const numpad = document.getElementById('sudoku-numpad')
    const numpadColumn = 3
    const keys = []
    let currentRow = []

    for (let i = 1; i <= size; i++) {
        currentRow.push(i.toString())
        if (currentRow.length === numpadColumn) {
            keys.push(currentRow)
            currentRow = []
        }
    }
    if (currentRow.length > 0) keys.push(currentRow)
    currentRow = ['DEL', 'Show Hint']
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
            if (key === 'Show Hint') {
                td.colSpan = numpadColumn
                btn.classList.add('show-hint-btn')
            }

            td.appendChild(btn)
            tr.appendChild(td)
        })

        numpad.appendChild(tr)
    })

    numpad.onclick = (event) => {
        if (event.target.tagName !== 'BUTTON') return
        const numpadValue = event.target.textContent
        if (marked_cell != null) {
            if (numpadValue === 'DEL') {
                let cell = marked_cell
                mark_cell(null)
                set_cell(cell[0], cell[1], null)
            } else {
                let cell = marked_cell
                mark_cell(null)
                set_cell(cell[0], cell[1], numpadValue)
            }
        }
        draw_sudoku(sudoku)
    }
}
