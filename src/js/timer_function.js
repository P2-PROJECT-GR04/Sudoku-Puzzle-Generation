let startTime = null
let timerId = null
let elapsedBeforePause = 0
let isPaused = false

//Loads saved time, updates every 500 ms so should be pretty good.
let saved = localStorage.getItem("sudokuTimer")
if (saved !== null) {
    elapsedBeforePause = Number(saved)
}

/**
 * Start the timer
 */
export function startTimer() {
    if (timerId !== null)
        return

    startTime = performance.now() - elapsedBeforePause

    function tick() {
        if (isPaused) 
            return
        const now = performance.now()
        const elapsed = now - startTime
        localStorage.setItem("sudokuTimer", elapsed)


        const minutes = Math.floor(elapsed / 60000)
        const seconds = Math.floor((elapsed % 60000) / 1000)
        const millis = Math.floor(elapsed % 1000)

        const formatted =
            `${String(minutes).padStart(2, '0')}:` +
            `${String(seconds).padStart(2, '0')}` //+
        //`${String(millis).padStart(3, '0')}`

        document.getElementById('timerDisplay').textContent = formatted

        timerId = setTimeout(tick, 500)
    }

    tick()
}

export function pauseTimer() {
    if (isPaused) 
        return
    isPaused = true

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
    if (!isPaused) 
        return
    isPaused = false

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
    localStorage.removeItem("sudokuTimer")

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

    localStorage.removeItem("elapsedBeforePause")
    localStorage.removeItem("isPaused")


    return totalMs
}

export function reapplyBlur(){
    if (!isPaused) 
        return;

       document.querySelectorAll("#sudoku *").forEach(el => {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        el.classList.add("sudoku-number-blur")}
    })
}