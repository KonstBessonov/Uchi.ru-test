"use strict";
(function () {

    window.onload = function () {
        var exercise = new Exercise();
        var view = new View(exercise);
        var controller = new Controller(view, exercise);
        view.init();
        controller.run();
    }

    /* *******************************************************************************************
     ******************************************************************************************* */
    function Controller(view, exercise) {
        var checkValue;
        var current;
        var nextStage, nextStageTimeout;

        this.run = function () {
            view.drawExercise();
            nextStageTimeout = 500;
            setTimeout(stage1, nextStageTimeout);
        }

        function onKeyPress(evt) {
            // numbers only
            return evt.charCode === 0 || /\d/.test(String.fromCharCode(evt.charCode));
        }

        function onInput() {
            if (parseInt(this.value) === checkValue) {
                this.parentNode.removeChild(this);
                view.drawExercise();
                if (nextStage) {
                    if (nextStageTimeout === 0) nextStage()
                    else setTimeout(nextStage, nextStageTimeout);
                }
            } else if (this.value === "") {
                this.style.color = "black";
                view.drawExercise();
            } else {
                this.style.color = "red";
                view.drawExercise({
                    mark: current
                });
            }
        }

        function stage1() {
            view.drawArrow(1);
            var input = view.drawInput(1);
            input.onkeypress = onKeyPress;
            input.oninput = onInput;
            input.focus();
            checkValue = exercise.a;
            current = 1;
            nextStage = stage2;
        }

        function stage2() {
            view.drawArrow(2);
            var input = view.drawInput(2);
            input.onkeypress = onKeyPress;
            input.oninput = onInput;
            input.focus();
            checkValue = exercise.b;
            current = 2;
            nextStage = stage3;
        }

        function stage3() {
            var input = view.drawResultInput();
            input.onkeypress = onKeyPress;
            input.oninput = onInput;
            input.focus();
            checkValue = exercise.result;
            current = 0;
            nextStage = stage4;
            nextStageTimeout = 0;
        }

        function stage4() {
            view.drawExercise({
                solved: true
            });
            nextStage = undefined;
        }

    }

    /* *******************************************************************************************
     ******************************************************************************************* */
    function Exercise() {
        this.a = 0;
        this.b = 0;
        this.result = 0;
        var that = this;
        this.generate = function () {
            that.a = Math.floor(Math.random() * 4) + 6;
            that.result = Math.floor(Math.random() * 4) + 11;
            that.b = that.result - that.a;
        }
        that.generate();
    }

    /* *******************************************************************************************
     ******************************************************************************************* */
    function View(exercise) {

        var canvas, ctx;

        var topExercise;
        var ruler;
        var arrows;

        this.init = function () {
            canvas = document.getElementById("canvas");
            canvas.height = canvas.clientHeight;
            canvas.width = canvas.clientWidth;

            ctx = canvas.getContext("2d");
            ctx.textBaseline = "top";

            topExercise = new TopExercise(exercise);

            ruler = new Ruler();
            ruler.draw();

            arrows = [];
            arrows[0] = new Arrow(0, exercise.a);
            arrows[1] = new Arrow(exercise.a, exercise.result);

        }

        /*
            options:
                mark: 1, 2 - number of marked operand; other - no action
                solved: true - draw result text; other - draw question sign
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

        /*
            num - number of arrow to draw
        */
        this.drawArrow = function (num) {
            arrows[num - 1].draw();
            arrows[num - 1].drawValue();
        }

        /*
            num - number of arrow input to draw
        */
        this.drawInput = function (num) {
            return arrows[num - 1].drawInput();
        }

        this.drawResultInput = function () {
            return topExercise.drawInput();
        }

        /*******************************************/
        // line on top with exercise text and result input
        /*******************************************/
        function TopExercise(exercise) {
            var exerciseText = exercise.a + " + " + exercise.b + " = ";
            var resultText = exercise.result.toString();
            var params = {};

            init(params);

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

            this.clear = function () {
                ctx.clearRect(params.left - params.markPadding, params.top, params.width + 2 * params.markPadding, params.fontSize);
            }

            this.drawExercise = function () {
                ctx.textAlign = "left";
                ctx.fillStyle = params.textColor;
                ctx.font = params.fontSize + "px " + params.fontFamily;
                ctx.fillText(exerciseText, params.left, params.top);
            }

            /*
                num - number of operand to draw mark
            */
            this.drawOpMark = function (num) {
                ctx.fillStyle = params.markColor;
                ctx.fillRect(params.opLeft[num - 1] - params.markPadding, params.top, params.opWidth[num - 1] + 2 * params.markPadding, params.fontSize);

            }

            this.drawQuestionSign = function () {
                ctx.textAlign = "left";
                ctx.fillStyle = params.textColor;
                ctx.font = params.fontSize + "px " + params.fontFamily;
                ctx.fillText("?", params.resultLeft, params.top);
            }

            this.drawResult = function () {
                ctx.textAlign = "left";
                ctx.fillStyle = params.textColor;
                ctx.font = params.fontSize + "px " + params.fontFamily;
                ctx.fillText(resultText, params.resultLeft, params.top);
            }

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

        /*******************************************/
        // just a ruler
        /*******************************************/
        function Ruler() {
            this.left = 0;
            this.top = 0;
            this.zeroPos = 35; // margin of the '0' mark from left side of sprite 
            this.stepSize = 39; // and distance between ruler marks

            this.draw = function () {
                var img = document.getElementById("ruler");
                this.left = (canvas.width - img.width) / 2 ^ 0;
                this.top = canvas.height - img.height - 20;
                ctx.drawImage(img, this.left, this.top);
            }

        }

        /*******************************************/
        // arrows and inputs for its
        // start, end - positions on ruler
        /*******************************************/
        function Arrow(start, end) {
            var params = {};

            init(params);

            function init(_p) {
                _p.value = end - start;
                _p.left = ruler.left + ruler.zeroPos + start * ruler.stepSize;
                _p.right = ruler.left + ruler.zeroPos + end * ruler.stepSize;
                _p.center = (_p.left + _p.right) / 2 ^ 0;
                _p.control = (_p.right - _p.left) / 4 ^ 0; // length of bezier control point. Bending amount of arrow.
                _p.bottom = ruler.top + 20;
                // approximate top of arrow. error +- 1px. '(end - start)*22/9' is microcorrection coefficient
                _p.top = _p.bottom - _p.control + (end - start) * 22 / 9 ^ 0;
                // arrow cap (W)idth & (L)ength
                _p.capW = 5;
                _p.capL = 3 * _p.capW;
                _p.strokeStyle = 'red';
                _p.lineWidth = 2;
                _p.fontSize = 36;
                _p.fontFamily = "sans-serif";
                _p.valueGap = 20; // distance between value text (or input) and top of the arrow
            }

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

            this.drawValue = function () {
                ctx.textAlign = "center";
                ctx.font = params.fontSize + "px " + params.fontFamily;
                ctx.fillText(params.value, params.center, params.top - params.valueGap - params.fontSize);

            }

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
})();