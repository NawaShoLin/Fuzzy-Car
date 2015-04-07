var Position = function(x, y) {
    var defaults = {x: 0, y: 0};
    x = x || defaults.x;
    y = y || defaults.y;

    return {x: x, y: y};
};