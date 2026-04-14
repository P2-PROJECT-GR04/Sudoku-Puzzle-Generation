import { mark_cell } from './script.js'
import { Sudoku } from './sudoku.js'

/**
 * Draws a Sudoku to the HTML document.
 * Needs a div with the id "sudoku" and the class "sudoku-grid"
 * @modifies {document}
 * @param {Sudoku} sudoku
 */
export function draw_sudoku(sudoku) {
    let board = document.getElementById('sudoku')

    board.innerText = ''
    board.style =
        'grid-template-columns: ' + 'auto '.repeat(sudoku.region_height) + ';'

    let regions = []
    for (let i = 0; i < sudoku.region_height; i++) {
        for (let j = 0; j < sudoku.region_width; j++) {
            let region = document.createElement('div')
            region.className = 'sudoku-region'
            region.style =
                'grid-template-columns: ' +
                'auto '.repeat(sudoku.region_width) +
                ';'
            regions.push(region)
        }
    }

    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            let cell = document.createElement('button')

            cell.className = 'sudoku-cell'
            cell.onclick = () => mark_cell(sudoku, [r, c])

            cell.appendChild(sudoku.grid[r][c].to_html())

            let raw_idx = r * sudoku.size + c
            let idx =
                Math.floor(c / sudoku.region_width) +
                sudoku.region_height *
                    Math.floor(raw_idx / (sudoku.size * sudoku.region_height))

            // let candidateContainer = document.createElement('div')
            // candidateContainer.className = 'candidate-grid'
            // for (let cr = 0; cr < sudoku.size / sudoku.size; cr++)
            //     for (let cc = 0; cc < sudoku.size / sudoku.size; cc++) {
            //         let candidate = document.createElement('span')
            //         candidate.className = 'sudoku-cell-candidate'
            //
            //         let candidateNum = cr * sudoku.region_width + cc + 1
            //         candidate.innerText = candidateNum
            //         candidateContainer.appendChild(candidate)
            //     }
            // cell.appendChild(candidateContainer)
            regions[idx].appendChild(cell)
        }
    }

    for (let i = 0; i < regions.length; i++) {
        board.appendChild(regions[i])
    }
}
