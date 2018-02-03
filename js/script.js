"use strict";
/* global Exercise, View, Controller */

(function () {

    window.onload = function () {
        var exercise = new Exercise();
        var view = new View(exercise);
        var controller = new Controller(view, exercise);
        view.init();
        controller.run();
    }

})();