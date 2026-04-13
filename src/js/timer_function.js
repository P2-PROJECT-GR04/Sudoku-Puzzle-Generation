let startTime = null
let timerId = null
let elapsedBeforePause = 0
let isPaused = false

/**
 * Start the timer
 */
export function startTimer() {
     if (startTime !== null) 
         return

    startTime = performance.now() - elapsedBeforePause

    function tick() {
        if (isPaused) 
            return
        const now = performance.now()
        const elapsed = now - startTime

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
    elapsedBeforePause = performance.now() - startTime

   document.querySelectorAll("#sudoku *").forEach(el => {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        el.classList.add("sudoku-number-blur")}
    })

}

export function resumeTimer() {
    if (!isPaused) 
        return
    isPaused = false

    document.querySelectorAll(".sudoku-number-blur").forEach(el =>
    el.classList.remove("sudoku-number-blur"))

    startTimer()
}

/**
 * Stop the timer and reset its time
 * @returns {number} The number of ms since the timer started
 */
export function stopTimer() {
    clearTimeout(timerId)

    const totalMs = performance.now() - startTime
    startTime = null

    localStorage.removeItem("elapsedBeforePause")
    localStorage.removeItem("isPaused")


    return totalMs
}
