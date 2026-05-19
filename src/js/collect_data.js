import { EASY, MEDIUM, HARD, removeCells } from './remove_cells.js'
import { initState, state } from './state.js'
import { newSeed, Rng } from './rand.js'
import { make_solved_grid, Sudoku } from './sudoku.js'
import { grade } from './difficulty_grader.js'

export function collect_data(iterations = 100) {
    initState()

    const difficulties = [EASY, MEDIUM, HARD]

    let grade_csv = init_headers(iterations)
    let time_csv = init_headers(iterations)
    let iter_csv = init_headers(iterations)

    for (let diff of difficulties) {
        console.info(`# TESTING '${diffStr(diff).toUpperCase()}'`)
        let grade_data = []
        let time_data = []
        let iter_data = []

        for (let i = 0; i < iterations; i++) {
            state.seed = newSeed()

            let rand = new Rng(state.seed)
            // state.rand = rand

            state.sudoku = new Sudoku(3, 3)

            make_solved_grid(state.sudoku, rand)

            const start_time = performance.now()
            removeCells(rand, state.sudoku, diff, iter_data)
            const end_time = performance.now()

            let score = grade(state.sudoku)
            grade_data.push(score)

            let time = end_time - start_time
            time_data.push(time)

            console.info(`-grade ${diffStr(diff)}(${i}):  ${score}`)
        }

        grade_csv += to_row(diffStr(diff), grade_data)
        time_csv += to_row(diffStr(diff), time_data)
        iter_csv += to_row(diffStr(diff), iter_data)
    }

    save_to_file('grade.csv', grade_csv)
    save_to_file('time.csv', time_csv)
    save_to_file('iter.csv', iter_csv)
}

/**
 * @param {string} name
 * @param {any[]} data
 */
function to_row(name, data) {
    let str = `${name},`

    for (let point of data) {
        str += `${point},`
    }

    str = str.slice(0, -1)
    str += '\n'

    return str
}

/**
 * @param {number} data_cols
 */
function init_headers(data_cols) {
    let str = 'difficulty,'

    for (let i = 0; i < data_cols; i++) {
        str += `data ${i},`
    }

    str = str.slice(0, -1)
    str += '\n'

    return str
}

/**
 * @param {string} file_name
 * @param {string} contents
 */
async function save_to_file(file_name, contents) {
    let a = document.createElement('a')
    var file = new Blob([contents], { type: 'text/csv' })
    a.href = URL.createObjectURL(file)
    a.download = file_name
    a.click()
    return

    var taBlob = new Blob([contents], { type: 'text/csv' })

    const pickerOptions = {
        suggestedName: `${file_name.toLowerCase()}.txt`,

        types: [
            {
                description: 'CSV file',

                accept: {
                    'text/csv': ['.csv'],
                },
            },
        ],
    }

    const fileHandle = await window.showSaveFilePicker(pickerOptions)

    const writableFileStream = await fileHandle.createWritable()

    await writableFileStream.write(taBlob)

    await writableFileStream.close()
}

function diffStr(diff) {
    if (diff == EASY) {
        return 'easy'
    }
    if (diff == MEDIUM) {
        return 'medium'
    }
    if (diff == HARD) {
        return 'hard'
    }
}
