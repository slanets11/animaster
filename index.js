addListeners();

function addListeners() {

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    let currentMoveAndHide;

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            currentMoveAndHide = animaster().moveAndHide(block, 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {

            if (currentMoveAndHide) {
                currentMoveAndHide.reset();
            }

        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 6000);
        });

    let currentHeartBeating;

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {

            const block = document.getElementById('heartBeatingBlock');
            currentHeartBeating = animaster().heartBeating(block);

        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {

            if (currentHeartBeating) {
                currentHeartBeating.stop();
            }

        });
}


function animaster() {

    const anim = {
        _steps: []
    };

    // reset functions

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    // base animations

    function fadeIn(element, duration) {

        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');

    }

    function fadeOut(element, duration) {

        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');

    }

    function move(element, duration, translation) {

        animaster()
            .addMove(duration, translation)
            .play(element);

    }

    function scale(element, duration, ratio) {

        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);

    }

    function moveAndHide(element, duration) {

        const moveDuration = duration * 2/5;
        const fadeDuration = duration * 3/5;

        move(element, moveDuration, {x:100, y:20});

        const timeoutId = setTimeout(() => {
            fadeOut(element, fadeDuration);
        }, moveDuration);

        return {

            reset() {

                clearTimeout(timeoutId);

                resetFadeOut(element);
                resetMoveAndScale(element);

            }

        }

    }

    function showAndHide(element, duration) {

        const step = duration / 3;

        fadeIn(element, step);

        setTimeout(() => {
            fadeOut(element, step);
        }, step * 2);

    }

    function heartBeating(element) {

        const beatDuration = 500;

        function beat() {

            scale(element, beatDuration, 1.4);

            setTimeout(() => {
                scale(element, beatDuration, 1);
            }, beatDuration);

        }

        beat();

        const intervalId = setInterval(beat, beatDuration * 2);

        return {

            stop() {
                clearInterval(intervalId);
            }

        }

    }

    // step system

    anim.addMove = function(duration, translation) {

        this._steps.push({

            type: 'move',
            duration: duration,
            translation: translation

        });

        return this;

    }

    anim.play = function(element) {

        let delay = 0;

        this._steps.forEach(step => {
            setTimeout(() => {
                if (step.type === 'move') {

                    element.style.transitionDuration = `${step.duration}ms`;
                    element.style.transform = getTransform(step.translation, null);

                }
            }, delay);
            delay += step.duration;
        });
    }

    function getTransform(translation, ratio) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        return result.join(' ');
    }

    return {
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        showAndHide,
        heartBeating,
        addMove: anim.addMove,
        play: anim.play,
        _steps: anim._steps
    };
}