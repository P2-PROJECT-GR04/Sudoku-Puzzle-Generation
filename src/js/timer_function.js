import { state, updateState } from "./state.js"

let startTime = null
let timerId = null


let elapsedBeforePause = state?.time || 0

/**
 * Start the timer
 */
export function startTimer() {
    if (timerId !== null)
        return

    elapsedBeforePause = state?.time || 0
    startTime = performance.now() - elapsedBeforePause

    function tick() {
        if (state?.isPaused) 
            return

        const now = performance.now()
        const elapsed = now - startTime

        state.time = elapsed
        updateState(state)


        const minutes = Math.floor(elapsed / 60000)
        const seconds = Math.floor((elapsed % 60000) / 1000)

        const formatted =
            `${String(minutes).padStart(2, '0')}:` +
            `${String(seconds).padStart(2, '0')}` //+
        //`${String(millis).padStart(3, '0')}`

        document.getElementById('timerDisplay').textContent = formatted

        timerId = setTimeout(tick, 500)
    }

    tick()
}

// Updates time when gamestate is paused. 
export function updateTimerDisplayFromState() {
    const elapsed = state?.time || 0

    const minutes = Math.floor(elapsed / 60000)
    const seconds = Math.floor((elapsed % 60000) / 1000)

    const formatted =
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`

    document.getElementById('timerDisplay').textContent = formatted
}



export function pauseTimer() {
    if (state?.isPaused) 
        return
    state.isPaused = true
    state.isPaused = true
    updateState(state)

    clearTimeout(timerId)
    timerId = null
    elapsedBeforePause = performance.now() - startTime

    //Blurs all Numbers/Candidates
   document.querySelectorAll("#sudoku *").forEach(el => {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        el.classList.add("sudoku-number-blur")}
    })

    // Disables new sudoku button + numpad
    document.getElementById("gen-sudoku-button").classList.add("disabled")
    document.getElementById("sudoku-numpad").classList.add("disabled")
}

export function resumeTimer() {
    if (!state?.isPaused) 
        return
    state.isPaused = false
    updateState(state)

    // Removes the blurred Numbers/Candidates
    document.querySelectorAll(".sudoku-number-blur").forEach(el =>
    el.classList.remove("sudoku-number-blur"))

    // Re-enables new sudoku button + numpad
    document.getElementById("gen-sudoku-button").classList.remove("disabled")
    document.getElementById("sudoku-numpad").classList.remove("disabled")

    startTime = performance.now() - elapsedBeforePause

    startTimer()
}

export function resetTimer() {
    clearTimeout(timerId)
    timerId = null
    startTime = null
    elapsedBeforePause = 0
    
    state.time = 0
    state.isPaused = false
    updateState(state)

    const el = document.getElementById("timerDisplay")
    if (el) el.textContent = "00:00"
}

/**
 * Stop the timer and reset its time
 * @returns {number} The number of ms since the timer started
 */
export function stopTimer() {
    clearTimeout(timerId)
    timerId = null

    const totalMs = performance.now() - startTime
    startTime = null

    state.time = 0
    state.isPaused = false 
    updateState(state)


    return totalMs
}

export function reapplyBlur(){
    if (!state?.isPaused) 
        return;

       document.querySelectorAll("#sudoku *").forEach(el => {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        el.classList.add("sudoku-number-blur")}
    })
}

export function reapplyDisable() {
    if (!state?.isPaused)
        return

    document.getElementById("gen-sudoku-button").classList.add("disabled")
    document.getElementById("sudoku-numpad").classList.add("disabled")
}

export function reapplyPauseButtons() {
    const pauseBtn = document.getElementById("pauseBtn")
    const resumeBtn = document.getElementById("resumeBtn")

    if (state?.isPaused) {
        pauseBtn.style.display = "none"
        resumeBtn.style.display = "inline-block"
    } else {
        pauseBtn.style.display = "inline-block"
        resumeBtn.style.display = "none"
    }
}
