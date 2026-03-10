addListeners();

function addListeners() {
    document.getElementById('fadeInPlay').addEventListener('click', () => animaster().fadeIn(document.getElementById('fadeInBlock'), 5000));
    document.getElementById('movePlay').addEventListener('click', () => animaster().move(document.getElementById('moveBlock'), 1000, {x: 100, y: 10}));
    document.getElementById('scalePlay').addEventListener('click', () => animaster().scale(document.getElementById('scaleBlock'), 1000, 1.25));
    document.getElementById('fadeOutPlay').addEventListener('click', () => animaster().fadeOut(document.getElementById('fadeOutBlock'), 5000));

    let currentMoveAndHide;
    document.getElementById('moveAndHidePlay').addEventListener('click', () => {
        currentMoveAndHide = animaster().moveAndHide(document.getElementById('moveAndHideBlock'), 5000);
    });
    document.getElementById('moveAndHideReset').addEventListener('click', () => currentMoveAndHide?.reset());

    document.getElementById('showAndHidePlay').addEventListener('click', () => animaster().showAndHide(document.getElementById('showAndHideBlock'), 6000));

    let currentHeartBeating;
    document.getElementById('heartBeatingPlay').addEventListener('click', () => {
        currentHeartBeating = animaster().heartBeating(document.getElementById('heartBeatingBlock'));
    });
    document.getElementById('heartBeatingStop').addEventListener('click', () => currentHeartBeating?.stop());
    
    document.getElementById('chainPlay').addEventListener('click', () => {
        const block = document.getElementById('chainBlock');
        animaster()
            .addMove(200, {x: 40, y: 40})
            .addScale(800, 1.3)
            .addMove(200, {x: 80, y: 0})
            .addScale(800, 1)
            .addMove(200, {x: 40, y: -40})
            .addScale(800, 0.7)
            .addMove(200, {x: 0, y: 0})
            .addScale(800, 1)
            .play(block);
    });
}

function animaster() {
    return {
        _steps: [],

        addMove(duration, translation) {
            this._steps.push({ type: 'move', duration, translation });
            return this;
        },
        addScale(duration, ratio) {
            this._steps.push({ type: 'scale', duration, ratio });
            return this;
        },
        addFadeIn(duration) {
            this._steps.push({ type: 'fadeIn', duration });
            return this;
        },
        addFadeOut(duration) {
            this._steps.push({ type: 'fadeOut', duration });
            return this;
        },
        addDelay(duration) {
            this._steps.push({ type: 'delay', duration });
            return this;
        },

        play(element, cycled = false) {
            let timers = [];

            const initialState = {
                transform: element.style.transform,
                transitionDuration: element.style.transitionDuration,
                className: element.className
            };

            const run = () => {
                let delay = 0;
                this._steps.forEach(step => {
                    const timeout = setTimeout(() => {
                        element.style.transitionDuration = `${step.duration}ms`;

                        if (step.type === 'move') {
                            element.style.transform = `translate(${step.translation.x}px, ${step.translation.y}px)`;
                        } else if (step.type === 'scale') {
                            element.style.transform = `scale(${step.ratio})`;
                        } else if (step.type === 'fadeIn') {
                            element.classList.remove('hide');
                            element.classList.add('show');
                        } else if (step.type === 'fadeOut') {
                            element.classList.remove('show');
                            element.classList.add('hide');
                        }
                    }, delay);

                    timers.push(timeout);
                    delay += step.duration;
                });

                if (cycled) {
                    const cycleTimeout = setTimeout(run, delay);
                    timers.push(cycleTimeout);
                }
            };

            run();

            return {
                stop() {
                    timers.forEach(clearTimeout);
                    timers = [];
                },
                reset() {
                    timers.forEach(clearTimeout);
                    timers = [];
                    element.style.transitionDuration = initialState.transitionDuration;
                    element.style.transform = initialState.transform;
                    element.className = initialState.className;
                }
            };
        },
        
        buildHandler() {
            const self = this;
            return function() {
                self.play(this);
            };
        },
        
        move(element, duration, translation) { return this.addMove(duration, translation).play(element); },
        fadeIn(element, duration) { return this.addFadeIn(duration).play(element); },
        fadeOut(element, duration) { return this.addFadeOut(duration).play(element); },
        scale(element, duration, ratio) { return this.addScale(duration, ratio).play(element); },
        moveAndHide(element, duration) {
            return this.addMove(duration * 2/5, {x: 100, y: 20}).addFadeOut(duration * 3/5).play(element);
        },
        showAndHide(element, duration) {
            const step = duration / 3;
            return this.addFadeIn(step).addDelay(step).addFadeOut(step).play(element);
        },
        heartBeating(element) {
            return this.addScale(500, 1.4).addScale(500, 1).play(element, true);
        }
    };
}