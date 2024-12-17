document.addEventListener('DOMContentLoaded', function () {
    const playButton = document.getElementById('play');
    const pauseButton = document.getElementById('pause');
    const restartButton = document.getElementById('restart');
    const timerElement = document.getElementById('timer');

    const scoreElements = {
        score1: document.getElementById('score1'),
        score2: document.getElementById('score2'),
        score3: document.getElementById('score3'),
        score4: document.getElementById('score4'),
    };

    const updateScore = (element, delta) => {
        let score = parseInt(element.textContent, 10);
        score += delta;
        if (score < 0) score = 0;
        element.textContent = score;
    };

    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', () => {
            const scoreElement = scoreElements[button.dataset.score];
            updateScore(scoreElement, 1);
        });
    });

    document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', () => {
            const scoreElement = scoreElements[button.dataset.score];
            updateScore(scoreElement, -1);
        });
    });

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
    };

    playButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    restartButton.addEventListener('click', restartTimer);

    updateTimeDisplay();
});
