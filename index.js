addListeners();

function addListeners() {
    // ... (остальные слушатели без изменений) ...

    let heartBeatingAnimation; // Переменная для хранения запущенной анимации

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            // Запускаем и сохраняем объект с методом stop
            heartBeatingAnimation = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            // Если анимация была запущена, останавливаем её
            if (heartBeatingAnimation) {
                heartBeatingAnimation.stop();
            }
        });
}

/**
 * Создает и возвращает объект с методами для управления анимациями
 */
function animaster() {

    // --- ФУНКЦИИ СБРОСА (Скрытые) ---

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
        const intervalId = setInterval(beat, beatDuration * 2);

        // Возвращаем объект с методом stop для управления
        return {
            stop: function() {
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

    // Возвращаем объект с публичными методами
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