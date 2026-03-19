/// Draws a Sudoku grid
/// Needs a div with the id "sudoku" and the class "sudoku-grid"
export function draw_sudoku(grid) {
    let board = document.getElementById('sudoku')
    console.log(board.className)
    board.style = 'grid-template-columns: ' + 'auto'.repeat(grid.region_height)
    /*
    for (let i = 0; i < (grid.size * grid.size) / 1.5; i++) {
        let row = Math.floor(Math.random() * grid.size)
        let col = Math.floor(Math.random() * grid.size)
        grid.grid[row][col].num = null
    }
    */
    let regions = []
    for (let i = 0; i < grid.region_height; i++) {
        for (let j = 0; j < grid.region_width; j++) {
            let region = document.createElement('div')
            region.className = 'sudoku-region'
            region.style =
                'grid-template-columns: ' + 'auto'.repeat(grid.region_width)
            regions.push(region)
        }
    }

    for (let r = 0; r < grid.grid.length; r++) {
        for (let c = 0; c < grid.grid[r].length; c++) {
            let cell = document.createElement('div')

            cell.className = 'sudoku-cell'
            cell.appendChild(grid.grid[r][c].to_html())

            let raw_idx = r * grid.size + c
            let idx =
                Math.floor(c / grid.region_height) +
                grid.region_width *
                    Math.floor(raw_idx / (grid.size * grid.region_width))

            regions[idx].appendChild(cell)
        }
    }

    for (let i = 0; i < regions.length; i++) {
        board.appendChild(regions[i])
    }
}
