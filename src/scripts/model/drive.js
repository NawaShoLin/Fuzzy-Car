var Drive = function(leftDist, centerDist, rightDist) {
    'use strict';

    var nearDie = function(centerDist) {
        var dangerousDist = 6;
        var realDist = centerDist - 3;

        var v = (dangerousDist - realDist) / dangerousDist;
        return v < 0 ? 0 : v;
    };

    var enoughSpace = function(dist) {
        var max = 16;
        var v = dist / max;
        return v > 1? 1 : v;
    };

    var nextTheta = function(leftDist, centerDist, rightDist) {
        var dying = nearDie(centerDist);
        var enoughLeft = enoughSpace(leftDist);
        var enoughRight = enoughSpace(rightDist);

        var maxRad = MathHelper.degToRad(40);
        var turnV =(enoughLeft - enoughRight);

        return maxRad * (turnV + turnV * dying);
    };

    return nextTheta(leftDist, centerDist, rightDist);
};
