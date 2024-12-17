document.addEventListener('DOMContentLoaded', function () {
    const playButton = document.getElementById('play');
    const pauseButton = document.getElementById('pause');
    const restartButton = document.getElementById('restart');
    const timerText = document.getElementById('timer-text');
    const timerIcon = document.getElementById('timer-icon');

    const scoreElements = {
        score1: document.getElementById('score1'),
        score2: document.getElementById('score2')
    };

    let timer = null;
    let time = 30; // start with 30 seconds for autonomous period
    let phase = 'autonomous'; // phases: autonomous, sampling, teleop
    let scores = { alliance1: 0, alliance2: 0 };

    const updateTimeDisplay = () => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerText.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const startTimer = () => {
        if (!timer) {
            timer = setInterval(() => {
                if (time > 0) {
                    time--;
                    updateTimeDisplay();
                    if (time === 0) {
                        switch (phase) {
                            case 'autonomous':
                                phase = 'sampling';
                                time = 8;
                                timerIcon.src = 'hand.png';
                                break;
                            case 'sampling':
                                phase = 'teleop';
                                time = 120;
                                timerIcon.src = 'controller.png';
                                doubleSampleSpecimenScores();
                                document.querySelectorAll('.teleop-only').forEach(button => button.disabled = false);
                                break;
                            case 'teleop':
                                clearInterval(timer);
                                timer = null;
                                break;
                        }
                        updateTimeDisplay();
                    }
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
        time = 30;
        phase = 'autonomous';
        timerIcon.src = 'robot.png';
        updateTimeDisplay();
        document.querySelectorAll('.teleop-only').forEach(button => button.disabled = true);
        scoreElements.score1.textContent = '0';
        scoreElements.score2.textContent = '0';
        scores = { alliance1: 0, alliance2: 0 };
    };

    const doubleSampleSpecimenScores = () => {
        scores.alliance1 *= 2;
        scores.alliance2 *= 2;
        scoreElements.score1.textContent = scores.alliance1;
        scoreElements.score2.textContent = scores.alliance2;
    };

    playButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    restartButton.addEventListener('click', restartTimer);

    document.querySelectorAll('.score-button').forEach(button => {
        button.addEventListener('click', function () {
            const points = parseInt(this.getAttribute('data-points'));
            const alliance = this.getAttribute('data-alliance');
            const description = this.getAttribute('data-description');

            if (phase === 'autonomous' && (description.includes('samples') || description.includes('specimens'))) {
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
        scores[`alliance${alliance}`] += points;
        scoreElement.textContent = scores[`alliance${alliance}`];
    };

    // Initialize
    updateTimeDisplay();
    document.querySelectorAll('.teleop-only').forEach(button => button.disabled = true);
});
