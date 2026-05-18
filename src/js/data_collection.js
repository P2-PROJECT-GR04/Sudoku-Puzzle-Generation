import { grade } from './difficulty_grader.js'
import { newSeed, Rng } from './rand.js'
import { EASY, MEDIUM, HARD, removeCells } from './remove_cells.js'
import { state, initState } from './state.js'
import { make_solved_grid, Sudoku } from './sudoku.js'

const TRIES = 100

export function collectData() {
    initState()

    let diffs = [EASY, MEDIUM, HARD]

    let data = []

    for (let diff of diffs) {
        data.push([])
        for (let i = 0; i < TRIES; i++) {
            state.seed = newSeed()
            state.rand = new Rng(state.seed)

            state.sudoku = new Sudoku(3, 3)
            make_solved_grid(state.sudoku, state.rand)
            removeCells(state.sudoku, state.rand, diff)

            let score = grade(state.sudoku)

            console.debug(
                `${difficultyString(diff).toUpperCase()}(${i}): ${score}`
            )

            data[diff].push(score)
        }
    }

    let csv_text = 'difficulty,'
    for (let i = 0; i < TRIES; i++) {
        csv_text += `try ${i},`
    }
    csv_text += '\n'

    for (let diff of diffs) {
        csv_text += `${difficultyString(diff)},`

        for (let point of data[diff]) {
            csv_text += `${point},`
        }
        csv_text += `\n`
    }

    console.log(csv_text)

    const blob = new Blob([csv_text], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'hello.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

function difficultyString(diff) {
    if (diff == 0) {
        return 'Easy'
    } else if (diff == 1) {
        return 'Medium'
    } else if (diff == 2) {
        return 'Hard'
    } else {
        return null
    }
}
