var Equation2D = function(p1, p2) {
    'use strict';

    // equation: ax + by = c

    var xDiff = p1.x - p2.x;
    var yDiff = p1.y - p2.y;

    this.a = yDiff;
    this.b = -xDiff;
    this.c = this.a * p1.x + this.b * p1.y;

    /**
     * Use Cramer's Rule
     */
    this.crossoverPoint = function(other) {
        var a, b, c, d, e, f;
        var allowedError = 1e-8;

        a = this.a;
        b = this.b;
        e = this.c;

        c = other.a;
        d = other.b;
        f = other.c;

        var denominator = a * d - b * c;
        if (Math.abs(denominator) < allowedError) {
            return null;
        }

        var x = (e * d - b * f) / denominator;
        var y = (a * f - e * c) / denominator;
        return Position(x, y);
    };

    this.closeToPoint = function(point) {
        var error = 1e-8;
        var v = point.x * this.a + point.y * this.b;
        return Math.abs(v - this.c) < error;
    };
};

var Line = function(startPoint, endPoint) {
    'use strict';

    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.equation = new Equation2D(startPoint, endPoint);

    this.isOnLine = function(point) {
        var inRange = function(point) {
            var ALLOWED_ERR = 1e-6;

            var x_max = Math.max(startPoint.x, endPoint.x) + ALLOWED_ERR;
            var y_max = Math.max(startPoint.y, endPoint.y) + ALLOWED_ERR;

            var x_min = Math.min(startPoint.x, endPoint.x) - ALLOWED_ERR;
            var y_min = Math.min(startPoint.y, endPoint.y) - ALLOWED_ERR;

            var inX = x_min <= point.x && point.x <= x_max;
            var inY = y_min <= point.y && point.y <= y_max;

            return inX && inY;
        };

        return inRange(point) && this.equation.closeToPoint(point);
    };
};

var Ray = function(point, rad) {
    var myEquation = MathHelper.EquationByPointAndRad(point, rad);

    this.crossoverPoint = function(otherLine) {
        var cPoint = myEquation.crossoverPoint(otherLine.equation);


        if (!cPoint || !otherLine.isOnLine(cPoint)) {
            return null;
        }


        var myVector = [Math.cos(rad), Math.sin(rad)];
        var toCPVector = [cPoint.x - point.x, cPoint.y - point.y];

        if (MathHelper.DotProduct(myVector, toCPVector) > 0) {
            return cPoint;
        } else {
            return null;
        }
    } ;
};

var MathHelper = (function() {
    MathHelper = {};

    MathHelper.degToRad = function(deg) {
        return deg * Math.PI / 180;
    };

    MathHelper.EquationByPointAndRad = function(point, rad) {
        var sin = Math.sin(rad);
        var cos = Math.cos(rad);
        var p2 = Position(point.x + cos, point.y + sin);

        var equation = new Equation2D(point, p2);
        return equation;
    };

    MathHelper.DotProduct = function(vector1, vector2) {
        var sum = 0;
        for (var i = 0; i < vector1.length; i += 1) {
            sum += vector1[i] * vector2[i];
        }
        return sum;
    };

    MathHelper.Distance = function(p1, p2) {
        var x_diff = p1.x - p2.x;
        var y_diff = p1.y - p2.y;
        return Math.sqrt(x_diff * x_diff + y_diff * y_diff);
    };

    MathHelper.IntRand = function(min, max) {
        var range = max - min + 1;
        return Math.floor((Math.random() * range) + min);
    };

    MathHelper.floatRand = function(min, max) {
        var range = max - min;
        return Math.random() * range + min;
    };

    return MathHelper;
})();