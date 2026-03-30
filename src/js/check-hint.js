export function show_hint(sudoku) {
    for (let r = 0; r < sudoku.size; r++) {
        for (let c = 0; c < sudoku.size; c++) {
            if (sudoku.grid[r][c].num == null) {
                let region_r_min =
                    Math.floor(r + 1 / sudoku.region_width) -
                    sudoku.region_width
                let region_r_max = region_r_min + sudoku.region_height - 1

                let region_c_min =
                    Math.floor(c + 1 / sudoku.region_height) -
                    sudoku.region_width
                let region_c_max = region_c_min + sudoku.region_width - 1

                let candidates = []
                for (let s = 1; s <= sudoku.size; s++) {
                    candidates.push(s)
                }
                console.log(candidates)
                for (let inner_r = 0; inner_r < sudoku.size; inner_r++) {
                    //This checks the row of a cell
                    if (candidates.indexOf(sudoku.grid[inner_r][c].num) != -1) {
                        console.log(
                            candidates[
                                candidates.indexOf(sudoku.grid[inner_r][c].num)
                            ]
                        )
                        candidates.splice(
                            candidates.indexOf(sudoku.grid[inner_r][c].num),
                            1
                        )
                        console.log(candidates)
                    }
                }
                for (let inner_c = 0; inner_c < sudoku.size; inner_c++) {
                    //This checks the colum of a cell
                    if (candidates.indexOf(sudoku.grid[r][inner_c].num) != -1) {
                        console.log(
                            candidates[
                                candidates.indexOf(sudoku.grid[r][inner_c].num)
                            ]
                        )
                        candidates.splice(
                            candidates.indexOf(sudoku.grid[r][inner_c].num),
                            1
                        )
                        //console.log(candidates)
                    }
                }
                //Now checks the correct region
                for (
                    let inner_r = region_r_min;
                    inner_r <= region_r_max;
                    inner_r++
                ) {
                    for (
                        let inner_c = region_c_min;
                        inner_c <= region_c_max;
                        inner_c++
                    ) {
                        if (
                            candidates.indexOf(sudoku.grid[r][inner_c].num) !=
                            -1
                        ) {
                            candidates.splice(
                                candidates.indexOf(
                                    sudoku.grid[inner_r][inner_c].num
                                ),
                                1
                            )
                            console.log(candidates)
                        }
                    }
                }
                sudoku.grid[r][c].candidates = [] //Reset the candidates for the cell
                sudoku.grid[r][c].candidates = candidates //Here the candidates we've found is getting into the cell class in the sudoku
                console.log(r, c)
                console.log(sudoku.grid[r][c].candidates)
            }
        }
    }
}
