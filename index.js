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

    // Новые обработчики для сложных анимаций
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

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block);
        });
}

/**
 * Создает и возвращает объект с методами для управления анимациями
 */
function animaster() {

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    /**
     * Блок плавно исчезает
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    /**
     * Сложная анимация: движение и исчезновение
     * @param element — HTMLElement, который надо анимировать
     * @param duration — общая продолжительность анимации в миллисекундах
     */
    function moveAndHide(element, duration) {
        const moveDuration = duration * 2/5;
        const fadeDuration = duration * 3/5;
        
        // Сначала движение
        move(element, moveDuration, {x: 100, y: 20});
        
        // Затем исчезновение
        setTimeout(() => {
            fadeOut(element, fadeDuration);
        }, moveDuration);
    }

    /**
     * Сложная анимация: появление, пауза и исчезновение
     * @param element — HTMLElement, который надо анимировать
     * @param duration — общая продолжительность анимации в миллисекундах
     */
    function showAndHide(element, duration) {
        const stepDuration = duration / 3;
        
        // Появление
        fadeIn(element, stepDuration);
        
        // Пауза (просто ждем)
        setTimeout(() => {
            // Исчезновение
            fadeOut(element, stepDuration);
        }, stepDuration * 2);
    }

    /**
     * Бесконечная анимация сердцебиения
     * @param element — HTMLElement, который надо анимировать
     */
    function heartBeating(element) {
        const beatDuration = 500; // 0.5 секунды на каждый шаг
        
        function beat() {
            // Увеличение
            scale(element, beatDuration, 1.4);
            
            // Возврат к исходному размеру
            setTimeout(() => {
                scale(element, beatDuration, 1);
            }, beatDuration);
        }
        
        // Запускаем первый удар
        beat();
        
        // Запускаем бесконечное повторение
        setInterval(beat, beatDuration * 2);
    }

    /**
     * Вспомогательная функция для сборки свойства transform
     */
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