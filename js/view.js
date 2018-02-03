"use strict";
/* exported View */

/**
 * Представление (View)
 * 
 * @constructor
 * @param {Object} exercise - объект задачи
 */
function View(exercise) {

    var currentExcercise = exercise;
    var canvas, ctx;

    var topExercise;
    var ruler;
    var arrows;

    /**
     * Инициализация представления, настройка высоты/ширины, создание подчиненных объектов,
     * отрисовка линейки
     */
    this.init = function () {
        canvas = document.getElementById("canvas");
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;

        ctx = canvas.getContext("2d");
        ctx.textBaseline = "top";

        topExercise = new TopExercise(currentExcercise);

        ruler = new Ruler();
        ruler.draw();

        arrows = [];
        arrows[0] = new Arrow(0, currentExcercise.a);
        arrows[1] = new Arrow(currentExcercise.a, currentExcercise.result);

    }

    /**
     * Отрисовывается уравнение с подсветкой одного из операндов или с отображением результата в зависомости от опций
     * 
     * @param {Object} options - опции отрисовки верхнего уравнения
     * @param {Number} options.mark - номер операнда, который нужно "подсветить" при отрисовке.
     * @param {Boolean} options.solved - Если "истина" - отрисовывается значение результата. Иначе "?"
     */
    this.drawExercise = function (options) {

        if (options === undefined)
            options = {};

        topExercise.clear();

        if (options.mark === 1 || options.mark === 2)
            topExercise.drawOpMark(options.mark);

        topExercise.drawExercise();

        if (options.solved === true) topExercise.drawResult()
        else topExercise.drawQuestionSign();
    }

    /**
     * Отрисовывает стрелку на поле
     * 
     * @param {Number} num - номер стрелки, которую нужно нарисовать
     */
    this.drawArrow = function (num) {
        arrows[num - 1].draw();
        arrows[num - 1].drawValue();
    }

    /**
     * Добавляет на поле инпут для ввода очередного операнда
     * 
     * @param {Number} num - номер стрелки, для которой нужно показать инпут
     * @returns {HTMLElement} - инпут типа "text"
     */
    this.drawInput = function (num) {
        return arrows[num - 1].drawInput();
    }

    /**
     * Добавляет на поле инпут для ввода результата
     * 
     * @returns {HTMLElement} - инпут типа "text"
     */
    this.drawResultInput = function () {
        return topExercise.drawInput();
    }

    /**
     * Верхняя строка с уравнением
     * 
     * @constructor
     * @param {Object} exercise - объект упражнения
     */
    function TopExercise(exercise) {
        var exerciseText = exercise.a + " + " + exercise.b + " = ";
        var resultText = exercise.result.toString();
        var params = {};

        init(params);

        /**
         * Параметры отображения строки уравнения
         * @typedef {Object} topExerciseParams
         * @property {Number} fontSize - размер шрифта (px)
         * @property {String} fontFamily - CSS имя шрифта
         * @property {Number} width - полная ширина
         * @property {Number} left - левая граница
         * @property {Number} top - верхнаяя граница
         * @property {Array.<Number>} opLeft - левые границы операндов
         * @property {Array.<Number>} opWidth - ширины операндов
         * @property {Number} resultLeft - левая граница результата
         * @property {String} textColor - CSS цвет текста уравнения
         * @property {String} markColor - CSS цвет отетки операнда
         * @property {Number} markPadding - отступ от операнда до границ отметки
         */

        /**
         * Заполняет параметры отображения строки уравнения
         * 
         * @param {topExerciseParams} _p - параметры отображения уравнения
         */
        function init(_p) {
            _p.fontSize = 48;
            _p.fontFamily = "sans-serif";
            ctx.font = _p.fontSize + "px " + _p.fontFamily;
            _p.width = ctx.measureText(exerciseText + resultText).width ^ 0;
            _p.left = (canvas.width - _p.width) / 2 ^ 0;
            _p.top = 30;
            _p.opLeft = [
                _p.left,
                _p.left + ctx.measureText(exercise.a + " + ").width ^ 0
            ];
            _p.opWidth = [
                ctx.measureText(exercise.a).width ^ 0,
                ctx.measureText(exercise.b).width ^ 0
            ];
            _p.resultLeft = _p.left + ctx.measureText(exerciseText).width ^ 0;
            _p.textColor = "black";
            _p.markColor = "orange";
            _p.markPadding = 2;
        }

        /**
         * Очищает область на которой нарисовано уравнение с учетом отступов до границ отметок операндов
         */
        this.clear = function () {
            ctx.clearRect(params.left - params.markPadding, params.top, params.width + 2 * params.markPadding, params.fontSize);
        }

        /**
         * Отрисовывает левую часть уравнения, до символа "=" включительно
         */
        this.drawExercise = function () {
            ctx.textAlign = "left";
            ctx.fillStyle = params.textColor;
            ctx.font = params.fontSize + "px " + params.fontFamily;
            ctx.fillText(exerciseText, params.left, params.top);
        }

        /**
         * Отрисовывает отметку под операндом в случае ошибки ввода
         * 
         * @param {Number} num - номер операнда под которым нужно нарисовать отметку
         */
        this.drawOpMark = function (num) {
            ctx.fillStyle = params.markColor;
            ctx.fillRect(params.opLeft[num - 1] - params.markPadding, params.top, params.opWidth[num - 1] + 2 * params.markPadding, params.fontSize);

        }

        /**
         * Отрисовывает символ "?" пока уравнение не решено
         */
        this.drawQuestionSign = function () {
            ctx.textAlign = "left";
            ctx.fillStyle = params.textColor;
            ctx.font = params.fontSize + "px " + params.fontFamily;
            ctx.fillText("?", params.resultLeft, params.top);
        }

        /**
         * Отрисовывает результат решенного уравнения
         */
        this.drawResult = function () {
            ctx.textAlign = "left";
            ctx.fillStyle = params.textColor;
            ctx.font = params.fontSize + "px " + params.fontFamily;
            ctx.fillText(resultText, params.resultLeft, params.top);
        }

        /**
         * Отрисовывает инпут для ввода результата решения уравнения справа от строки уравнения
         * 
         * @returns {HTMLElement} - инпут типа "text"
         */
        this.drawInput = function () {
            var input = document.createElement("input");

            document.getElementById("div").appendChild(input);
            input.type = "text";
            input.maxLength = 2;
            input.style.position = "absolute";
            input.style.fontSize = params.fontSize + "px";
            input.style.fontFamily = params.fontFamily;
            input.style.textAlign = "left";
            input.style.left = (params.resultLeft - input.clientLeft) + "px";
            input.style.top = (params.top - input.clientTop - 1) + "px";
            input.style.width = "2em";

            return input;
        }
    }

    /**
     * Линейка
     * 
     * @constructor
     */
    function Ruler() {
        this.left = 0;
        this.top = 0;
        Object.defineProperty(this, "zeroPos", { // Отступ от левой границы спрайта до отметки "0"
            configurable: false,
            value: 35,
            writable: false
        });
        Object.defineProperty(this, "stepSize", { // Шаг между метками на линейке
            configurable: false,
            value: 39,
            writable: false
        })

        /**
         * Отрисовывает линейку по горизонтали по центру родительского канваса, по вертикали в 20px от нижней границы
         */
        this.draw = function () {
            var img = document.getElementById("ruler");
            this.left = (canvas.width - img.width) / 2 ^ 0;
            this.top = canvas.height - img.height - 20;
            ctx.drawImage(img, this.left, this.top);
        }

    }

    /**
     * Стрелки на линейки и поля воода для них
     * 
     * @constructor
     * @param {Number} start - начальная позиция на линейке
     * @param {Number} end - конечная позиция на линейке
     */
    function Arrow(start, end) {
        var params = {};

        init(params);

        /**
         * Параметры отображения стрелок
         * @typedef {Object} arrowParams
         * @property {Number} value - длина стрелки (разность между конечным и начальным значениями)
         * @property {Number} left - левая граница
         * @property {Number} right - правая граница
         * @property {Number} center - центр стрелки по горизонтали
         * @property {Number} control - расстояние до опорных точек кривой Безье. Определяет степень кривизны стрелки.
         * @property {Number} bottom - нижняя граница
         * @property {Number} top - верхняя граница
         * @property {Number} capW - длина окончания стрелки
         * @property {Number} capL - ширина окончания стрелки
         * @property {String} strokeStyle - CSS цвет линии стрелки
         * @property {Number} lineWidth - толщина стрелки
         * @property {Number} fontSize - размер шрифта (px)
         * @property {String} fontFamily - CSS имя шрифта
         * @property {Number} valueGap - расстояние от верха стрелки до поля ввода или надписи значения
         */

        /**
         * Заполняет параметры отображения стрелки
         * 
         * @param {arrowParams} _p - параметры отображения стрелки
         */
        function init(_p) {
            _p.value = end - start;
            _p.left = ruler.left + ruler.zeroPos + start * ruler.stepSize;
            _p.right = ruler.left + ruler.zeroPos + end * ruler.stepSize;
            _p.center = (_p.left + _p.right) / 2 ^ 0;
            _p.control = (_p.right - _p.left) / 4 ^ 0;
            _p.bottom = ruler.top + 20;
            // Приблизительный верх стрелки. Для опорных точек в 1/4 длины стрелки корректирующий коэффициент '(end - start)*22/9'
            // Для других опорных точек необходимо подбирать!
            _p.top = _p.bottom - _p.control + (end - start) * 22 / 9 ^ 0;
            _p.capW = 5;
            _p.capL = 3 * _p.capW;
            _p.strokeStyle = 'red';
            _p.lineWidth = 2;
            _p.fontSize = 36;
            _p.fontFamily = "sans-serif";
            _p.valueGap = 20;
        }

        /**
         * Отрисовывает стрелку на линейке
         */
        this.draw = function () {
            ctx.beginPath();
            ctx.strokeStyle = params.strokeStyle;
            ctx.lineWidth = params.lineWidth;
            ctx.moveTo(params.left, params.bottom);
            ctx.bezierCurveTo(params.left + params.control,
                params.bottom - params.control,
                params.right - params.control,
                params.bottom - params.control, params.right, params.bottom);
            ctx.moveTo(params.right - params.capW, params.bottom - params.capL);
            ctx.lineTo(params.right, params.bottom);
            ctx.lineTo(params.right - params.capL, params.bottom - params.capW);
            ctx.stroke();
        }

        /**
         * Отрисовывает значение над стрелкой
         */
        this.drawValue = function () {
            ctx.textAlign = "center";
            ctx.font = params.fontSize + "px " + params.fontFamily;
            ctx.fillText(params.value, params.center, params.top - params.valueGap - params.fontSize);

        }

        /**
         * Отрисовывает инпут для ввода значения операнда
         * 
         * @returns {HTMLElement} - инпут типа "text"
         */
        this.drawInput = function () {
            var input = document.createElement("input");

            document.getElementById("div").appendChild(input);
            input.type = "text";
            input.maxLength = 1;
            input.style.position = "absolute";
            input.style.fontSize = params.fontSize + "px";
            input.style.fontFamily = params.fontFamily;
            input.style.textAlign = "center";
            input.style.left = (params.center - input.clientLeft - params.fontSize / 2 ^ 0) + "px";
            input.style.top = (params.top - params.valueGap - input.clientTop - 1 - params.fontSize) + "px";
            input.style.width = "1em";

            return input;
        }

    }
}