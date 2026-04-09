let startTime = null
let timerId = null

export function startTimer() {
    startTime = performance.now()

    function tick() {
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

export function stopTimer() {
    clearTimeout(timerId)

    const totalMs = performance.now() - startTime
    startTime = null

    return totalMs
}
