/// Draws a Sudoku grid

import { mark_cell } from './script.js'

/// Needs a div with the id "sudoku" and the class "sudoku-grid"
export function draw_sudoku(grid) {
    let board = document.getElementById('sudoku')

    board.innerText = ''
    board.style =
        'grid-template-columns: ' + 'auto '.repeat(grid.region_height) + ';'

    let regions = []
    for (let i = 0; i < grid.region_height; i++) {
        for (let j = 0; j < grid.region_width; j++) {
            let region = document.createElement('div')
            region.className = 'sudoku-region'
            region.style =
                'grid-template-columns: ' +
                'auto '.repeat(grid.region_width) +
                ';'
            regions.push(region)
        }
    }

    for (let r = 0; r < grid.size; r++) {
        for (let c = 0; c < grid.size; c++) {
            let cell = document.createElement('button')

            cell.className = 'sudoku-cell'
            cell.onclick = () => mark_cell([r, c])
            cell.appendChild(grid.grid[r][c].to_html())

            let raw_idx = r * grid.size + c
            let idx =
                Math.floor(c / grid.region_width) +
                grid.region_height *
                    Math.floor(raw_idx / (grid.size * grid.region_height))

            regions[idx].appendChild(cell)
        }
    }

    for (let i = 0; i < regions.length; i++) {
        board.appendChild(regions[i])
    }
}
