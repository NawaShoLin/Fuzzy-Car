var Drive = function(leftSensor, centerSensor, rightSensor) {

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

    var nextTheta = function() {
        var left = leftSensor.distToBar();
        var center = centerSensor.distToBar();
        var right = rightSensor.distToBar();

        var dying = nearDie(center);
        var enoughLeft = enoughSpace(left);
        var enoughRight = enoughSpace(right);

        var maxRad = MathHelper.degToRad(40);
        var trunV =(enoughLeft - enoughRight);

        return maxRad * (trunV + trunV * dying);
    };

    return nextTheta;
};