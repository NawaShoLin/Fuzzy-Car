var Car = function(position, phi, speed, carLength) {
    var defaults = {
        phi: MathHelper.degToRad(90),
        speed: 1,
        carLength: 6
    };

    position = position || Position();
    phi = phi || defaults.phi;
    speed = speed || defaults.speed;
    carLength = carLength || defaults.carLength;


    var nextX = function(theta) {
        var unitX = position.x +
            Math.cos(phi + theta) +
            Math.sin(theta) * Math.sin(phi);
        return speed * unitX;
    };

    var nextY = function(theta) {
        var unitY = osition.y +
            Math.sin(phi + theta) -
            Math.sin(theta) * Math.cos(phi);
        return speed * unitY;
    };

    var thresholdValue = function(v, min, max) {
        if (v > max) {
            v = max;
        } else if (v < min) {
            v = min;
        }

        return v;
    };

    var thresholdTheta = function(theta) {
        var minTheta = MathHelper.degToRad(-40);
        var maxTheta = MathHelper.degToRad(40);

        return thresholdValue(theta, minTheta, maxTheta);
    };

    var thresholdPhi = function(phi) {
        var min = MathHelper.degToRad(-90);
        var max = MathHelper.degToRad(270);

        return thresholdValue(phi, min, max);
    };

    this.nextPosition = function(theta) {
        theta = thresholdTheta(theta);
        return Position(nextX(theta), nextY(theta));
    };

    this.nextPhi = function(theta) {
        theta = thresholdTheta(theta);
        var p = phi - Math.asin(2 * Math.sin(theta) / carLength);
        return thresholdPhi(p);
    };

    this.move = function(theta) {
        var nextStat = {
            pos: this.nextPosition(theta),
            phi: this.nextPhi(theta)
        };
        position = nextStat.pos;
        phi = nextStat.phi;
    };

    this.position = function() {
        return position;
    };

    this.phi = function() {
        return phi;
    };
};