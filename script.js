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

    const counts = {
        samples1: document.getElementById('samples1-count'),
        samples2: document.getElementById('samples2-count'),
        samplesLow1: document.getElementById('samples-low1-count'),
        samplesLow2: document.getElementById('samples-low2-count'),
        samplesHigh1: document.getElementById('samples-high1-count'),
        samplesHigh2: document.getElementById('samples-high2-count'),
        specimensLow1: document.getElementById('specimens-low1-count'),
        specimensLow2: document.getElementById('specimens-low2-count'),
        specimensHigh1: document.getElementById('specimens-high1-count'),
        specimensHigh2: document.getElementById('specimens-high2-count'),
        ascent1_1: document.getElementById('ascent1-1-count'),
        ascent1_2: document.getElementById('ascent1-2-count'),
        observation1: document.getElementById('observation1-count'),
        observation2: document.getElementById('observation2-count'),
        ascent2_1: document.getElementById('ascent2-1-count'),
        ascent2_2: document.getElementById('ascent2-2-count'),
        ascent3_1: document.getElementById('ascent3-1-count'),
        ascent3_2: document.getElementById('ascent3-2-count')
    };

    let timer = null;
    let time = 30; // start with 30 seconds for autonomous period
    let phase = 'autonomous'; // phases: autonomous, sampling, teleop
    let scores = { alliance1: 0, alliance2: 0 };
    let scoreDoubled = false;

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
                                timerIcon.textContent = '✋';
                                break;
                            case 'sampling':
                                phase = 'teleop';
                                time = 120;
                                timerIcon.textContent = '🎮';
                                showTeleopButtons();
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
        scoreDoubled = false;
        timerIcon.textContent = '🤖';
        updateTimeDisplay();
        hideTeleopButtons();
        scoreElements.score1.textContent = '0';
        scoreElements.score2.textContent = '0';
        scores = { alliance1: 0, alliance2: 0 };
    };

    const showTeleopButtons = () => {
        document.querySelectorAll('.teleop-only').forEach(button => {
            button.style.display = 'inline-block';
        });
    };

    const hideTeleopButtons = () => {
        document.querySelectorAll('.teleop-only').forEach(button => {
            button.style.display = 'none';
        });
    };

    const doubleSampleSpecimenScores = () => {
        if (!scoreDoubled) {
            scores.alliance1 *= 2;
            scores.alliance2 *= 2;
            scoreElements.score1.textContent = scores.alliance1;
            scoreElements.score2.textContent = scores.alliance2;
            scoreDoubled = true;
        }
    };

    playButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    restartButton.addEventListener('click', restartTimer);

    document.querySelectorAll('.score-button').forEach(button => {
        button.addEventListener('click', function () {
            const points = parseInt(this.getAttribute('data-points'));
            const alliance = this.getAttribute('data-alliance');
            const description = this.getAttribute('data-description');

            // Update score count for the button
            const countId = this.getAttribute('data-description').replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase() + '-count';
            const countElement = counts[countId];
            let countValue = parseInt(countElement.textContent);
            countValue++;
            countElement.textContent = countValue;

            if (phase === 'sampling' && (description.includes('samples') || description.includes('specimens'))) {
                return; // Don't add points during sampling
            }

            if (phase === 'sampling' && time <= 0) {
                doubleSampleSpecimenScores();
            }

            updateScore(alliance, points);
        });
    });

    const updateScore = (alliance, points) => {
        const scoreElement = scoreElements[`score${alliance}`];
        scores[`alliance${alliance}`] += points;
        scoreElement.textContent = scores[`alliance${alliance}`];
    };

    // Initialize
    updateTimeDisplay();
    hideTeleopButtons();
});
