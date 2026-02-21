let timeLeft = 25 * 60;
let totalTime = 25 * 60;
let timerId = null;
const circumference = 2 * Math.PI * 130;

const minDisplay = document.getElementById('minutes');
const secDisplay = document.getElementById('seconds');
const progressCircle = document.getElementById('progress');
const startBtn = document.getElementById('start-btn');

function updateDisplay() {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    minDisplay.textContent = mins.toString().padStart(2, '0');
    secDisplay.textContent = secs.toString().padStart(2, '0');

    // Update SVG Ring
    const offset = circumference - (timeLeft / totalTime) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

function setMode(mode) {
    clearInterval(timerId);
    timerId = null;
    startBtn.textContent = 'Start';
    
    if (mode === 'work') {
        timeLeft = 25 * 60;
        document.documentElement.style.setProperty('--primary', '#ff6b6b');
        document.getElementById('status').textContent = 'Focus Time';
    } else {
        timeLeft = 5 * 60;
        document.documentElement.style.setProperty('--primary', '#4ecdc4');
        document.getElementById('status').textContent = 'Break Time';
    }
    totalTime = timeLeft;
    updateDisplay();
}

startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = 'Resume';
    } else {
        startBtn.textContent = 'Pause';
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerId);
                alert("Session Complete!");
            }
        }, 1000);
    }
});

// Initialize
progressCircle.style.strokeDasharray = circumference;
updateDisplay();