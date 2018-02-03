"use strict";
/* exported Controller */

/**
 * Контроллер
 * @constructor
 * @param {Object} view - объект для отображения поля задачи
 * @param {Object} exercise - объект задачи
 */
function Controller(view, exercise) {

    var currentView = view;
    var checkValue;
    var current;
    var nextStage, nextStageTimeout;

    /**
     * Основной цикл. Отрисовывает уравнение и запускает решение.
     */
    this.run = function () {
        currentView.drawExercise();
        nextStageTimeout = 500;
        setTimeout(stage1, nextStageTimeout);
    }

    /**
     * В инпуте допустимы только цифры
     * @param {*} evt - событие типа KeyboardEvent
     */
    function onKeyPress(evt) {
        return evt.charCode === 0 || /\d/.test(String.fromCharCode(evt.charCode));
    }

    /**
     * Обработчик ввода. Проверяет значение, введенное в поле. При необходимости устанавливает цвет
     * текста в инпуте и подсветку текущего операнда в уравнении.
     */
    function onInput() {
        if (parseInt(this.value) === checkValue) {
            this.parentNode.removeChild(this);
            currentView.drawExercise();
            if (nextStage) {
                if (nextStageTimeout === 0) nextStage()
                else setTimeout(nextStage, nextStageTimeout);
            }
        } else if (this.value === "") {
            this.style.color = "black";
            currentView.drawExercise();
        } else {
            this.style.color = "red";
            currentView.drawExercise({
                mark: current
            });
        }
    }

    /**
     * Этап 1. Поле ввода над первой стрелкой, ввод первого операнда. При успешном окончании - переход к этапу 2
     */
    function stage1() {
        currentView.drawArrow(1);
        var input = currentView.drawInput(1);
        input.onkeypress = onKeyPress;
        input.oninput = onInput;
        input.focus();
        checkValue = exercise.a;
        current = 1;
        nextStage = stage2;
    }

    /**
     * Этап 2. Поле ввода над второй стрелкой, ввод второго операнда. При успешном окончании - переход к этапу 3
     */
    function stage2() {
        currentView.drawArrow(2);
        var input = currentView.drawInput(2);
        input.onkeypress = onKeyPress;
        input.oninput = onInput;
        input.focus();
        checkValue = exercise.b;
        current = 2;
        nextStage = stage3;
    }

    /**
     * Этап 3. Поле ввода на результате уравнения, ввод результата. При успешном окончании - переход к этапу 4
     */
    function stage3() {
        var input = currentView.drawResultInput();
        input.onkeypress = onKeyPress;
        input.oninput = onInput;
        input.focus();
        checkValue = exercise.result;
        current = 0;
        nextStage = stage4;
        nextStageTimeout = 0;
    }

    /**
     * Этап 4. Отрисовка решенного уравнения. Задание завершено
     */
    function stage4() {
        currentView.drawExercise({
            solved: true
        });
        nextStage = undefined;
    }

}