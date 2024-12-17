document.addEventListener('DOMContentLoaded', function () {
    const playButton = document.getElementById('play');
    const pauseButton = document.getElementById('pause');
    const restartButton = document.getElementById('restart');
    const timerElement = document.getElementById('timer');

    const scoreElements = {
        score1: document.getElementById('score1'),
        score2: document.getElementById('score2'),
    };

    let isAutonomous = true;
    let timer;
    let time = 150; // 2:30 in seconds

    const updateTimeDisplay = () => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const startTimer = () => {
        if (!timer) {
            timer = setInterval(() => {
                if (time > 0) {
                    time--;
                    updateTimeDisplay();
                    if (time === 120) {
                        isAutonomous = false;
                        document.querySelectorAll('.teleop-only').forEach(button => {
                            button.disabled = false;
                        });
                    }
                } else {
                    clearInterval(timer);
                    timer = null;
                }
            }, 1000);
        }
    };

    const pauseTimer = () => {
        clearInterval(timer);
        timer = null;
    };

    const restartTimer = () => {
        pauseTimer();
        time = 150;
        updateTimeDisplay();
        isAutonomous = true;
        document.querySelectorAll('.teleop-only').forEach(button => {
            button.disabled = true;
        });
    };

    const updateScore = (element, points) => {
        let score = parseInt(element.textContent, 10);
        if (isAutonomous && ['samples (net zone)', 'samples (low basket)', 'samples (high basket)', 'specimens (low bar)', 'specimens (high bar)'].includes(points.description)) {
            score += points.value * 2;
        } else {
            score += points.value;
        }
        if (score < 0) score = 0;
        element.textContent = score;
    };

    playButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    restartButton.addEventListener('click', restartTimer);

    document.querySelectorAll('.score-button').forEach(button => {
        button.addEventListener('click', () => {
            const points = {
                value: parseInt(button.dataset.points, 10),
                description: button.dataset.description
            };
            const scoreElement = scoreElements[`score${button.dataset.score}`];
            updateScore(scoreElement, points);
        });
    });

    updateTimeDisplay();
    restartTimer(); // Initialize teleop-only buttons to be disabled on load
});
