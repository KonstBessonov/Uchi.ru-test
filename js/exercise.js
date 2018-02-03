"use strict";
/* exported Exercise */

/**
 * Уравнение (Model)
 * @constructor
 */
function Exercise() {
    this.a = 0;
    this.b = 0;
    this.result = 0;
    
    /**
     * Генерирует новое уравнение вида a+b=result согласно ограничениям:
     *  - 6<=a<=9
     *  - 11<=result<=14
     */
    this.generate = function () {
        this.a = Math.floor(Math.random() * 4) + 6;
        this.result = Math.floor(Math.random() * 4) + 11;
        this.b = this.result - this.a;
    }
    
    this.generate();
}