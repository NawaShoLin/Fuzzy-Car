/**
 * @params {number} x
 * @params {number} y
 * @returns {object} An object has attr x and y
 */
var Position = function(x, y) {
    'use strict';

    var defaults = {x: 0, y: 0};
    x = x || defaults.x;
    y = y || defaults.y;

    return {x: x, y: y};
};
