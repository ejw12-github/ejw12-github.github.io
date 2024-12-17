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
                    if (time === 120) { // 30 seconds for autonomous
                        isAutonomous = false;
                        document.querySelectorAll('.teleop-only').forEach(button => button.disabled = false);
                    }
                } else {
                    clearInterval(timer);
                    timer = null;
                }
            }, 1000);
        }
    };

    const pauseTimer = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };

    const restartTimer = () => {
        pauseTimer();
        time = 150;
        isAutonomous = true;
        updateTimeDisplay();
        document.querySelectorAll('.teleop-only').forEach(button => button.disabled = true);
        scoreElements.score1.textContent = '0';
        scoreElements.score2.textContent = '0';
    };

    playButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    restartButton.addEventListener('click', restartTimer);

    document.querySelectorAll('.score-button').forEach(button => {
        button.addEventListener('click', function () {
            const points = parseInt(this.getAttribute('data-points'));
            const alliance = this.getAttribute('data-alliance');
            const description = this.getAttribute('data-description');

            if (isAutonomous && (description.includes('samples') || description.includes('specimens'))) {
                updateScore(alliance, points * 2);
            } else {
                updateScore(alliance, points);
            }
        });
    });

    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', function () {
            const scoreId = this.getAttribute('data-score');
            updateScore(scoreId, 1);
        });
    });

    document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', function () {
            const scoreId = this.getAttribute('data-score');
            updateScore(scoreId, -1);
        });
    });

    const updateScore = (alliance, points) => {
        const scoreElement = scoreElements[`score${alliance}`];
        const currentScore = parseInt(scoreElement.textContent);
        scoreElement.textContent = currentScore + points;
    };

    // Initialize
    updateTimeDisplay();
    document.querySelectorAll('.teleop-only').forEach(button => button.disabled = true);
});
