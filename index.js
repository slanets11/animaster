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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 6000);
        });

    // Переменная для хранения объекта анимации сердцебиения
    let currentHeartBeating;

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            // Запускаем анимацию и сохраняем объект с методом stop
            currentHeartBeating = animaster().heartBeating(block);
        });

    // Обработчик для кнопки Stop
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            // Если анимация была запущена, останавливаем её
            if (currentHeartBeating) {
                currentHeartBeating.stop();
            }
        });
}

/**
 * Создает и возвращает объект с методами для управления анимациями
 */
function animaster() {

    // --- Служебные функции сброса (недоступны снаружи) ---

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

    // --- Основные методы анимации ---

    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function moveAndHide(element, duration) {
        const moveDuration = duration * 2/5;
        const fadeDuration = duration * 3/5;

        move(element, moveDuration, {x: 100, y: 20});

        setTimeout(() => {
            fadeOut(element, fadeDuration);
        }, moveDuration);
    }

    function showAndHide(element, duration) {
        const stepDuration = duration / 3;

        fadeIn(element, stepDuration);

        setTimeout(() => {
            fadeOut(element, stepDuration);
        }, stepDuration * 2);
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
        // Сохраняем ID интервала, чтобы его можно было остановить
        const intervalId = setInterval(beat, beatDuration * 2);

        // Возвращаем объект с методом stop
        return {
            stop() {
                clearInterval(intervalId);
            }
        };
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
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        move: move,
        scale: scale,
        moveAndHide: moveAndHide,
        showAndHide: showAndHide,
        heartBeating: heartBeating
    };
}