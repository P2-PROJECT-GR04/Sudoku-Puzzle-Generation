import { draw_sudoku } from './draw_sudoku.js'
import { mark_cell, set_cell } from './script.js'
import { check_board, Sudoku } from './sudoku.js'
import { show_hint } from './check-hint.js'

/**
 * Creates a numpad and inserts it into the HTMl document.
 * Needs a table with the id "sudoku-numpad"
 * @param {Sudoku} sudoku
 */
export function createNumpad(sudoku) {
    const numpad = document.getElementById('sudoku-numpad')
    numpad.innerText = ''
    const numpadColumn = 3
    const keys = []
    let currentRow = [] //This is used to insert paired elements in numpad keys array

    for (let i = 1; i <= sudoku.size; i++) {
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
            sudoku.marked_cell != null &&
            numpadValue !== 'Check board' &&
            numpadValue !== 'Show hint'
        ) {
            let cell = sudoku.marked_cell
            mark_cell(sudoku, null)
            if (numpadValue === 'DEL') {
                set_cell(sudoku, cell[0], cell[1], null)
            } else {
                set_cell(sudoku, cell[0], cell[1], numpadValue)
            }
        }
        if (numpadValue == 'Check board') {
            console.log('Checking board')
            //check_board(sudoku)

            if (has_one_solution(sudoku)) {
                console.log('has one solution')
            } else {
                console.log('has no or more solutions')
            }
        }
        if (numpadValue == 'Show hint') {
            console.log('Show hints')
            find_candidates_for_grid(sudoku)
        }
        draw_sudoku(sudoku)
    }

    document.addEventListener('keydown', function (event) {
        console.log(`GOT INPUT: ${event.key}`)
        if (sudoku.marked_cell != null) {
            if (event.key === 'Delete' || event.key === 'Backspace') {
                let cell = sudoku.marked_cell
                mark_cell(sudoku, null)
                set_cell(sudoku, cell[0], cell[1], null)
            } else {
                let num = Number.parseInt(event.key)
                if (isNaN(num) || num == 0 || num > sudoku.size) return

                let cell = sudoku.marked_cell
                mark_cell(sudoku, null)
                set_cell(sudoku, cell[0], cell[1], event.key)
            }
        }
        draw_sudoku(sudoku)
    })
}
