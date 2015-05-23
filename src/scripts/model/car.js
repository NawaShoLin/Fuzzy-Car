/**
 * An auto car
 * @constructor
 * @param {object} [position=(0,0)] - init position of the car, a object has attr 'x' and 'y'.
 * @param {number} [phi=PI/2] - the angle of car in radian.
 * @param {number} [speed=1] - speed of the car.
 * @param {number} [carLength=6] - Length of the car.
 */
var Car = function(position, phi, speed, carLength) {
    'use strict';

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
        var unitY = position.y +
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
        return phi;
    };

    /**
     * @returns {object} The next position after move with the theta angle
     * @param {number} theta - a angle in in radian
     */
    this.nextPosition = function(theta) {
        theta = thresholdTheta(theta);
        return Position(nextX(theta), nextY(theta));
    };

    /**
     * @param {number} theta - a angle in in radian
     */
    this.nextPhi = function(theta) {
        theta = thresholdTheta(theta);
        var p = phi - Math.asin(2 * Math.sin(theta) / carLength);
        return thresholdPhi(p);
    };

    /**
     * Move the car with angle theta
     * @param {number} theta - a angle in in radian
     */
    this.move = function(theta) {
        var nextStat = {
            pos: this.nextPosition(theta),
            phi: this.nextPhi(theta)
        };
        position = nextStat.pos;
        phi = nextStat.phi;
    };

    /**
     * @returns {object}
     */
    this.position = function() {
        return position;
    };

    /**
     * @returns {number}
     */
    this.phi = function() {
        return phi;
    };

    /**
     * @returns {number}
     */
    this.carLength = function() {
        return carLength;
    };

    /**
     * Clone this car
     * @returns {object} the clone of this car
     */
    this.clone = function() {
        var c_pos = Position(position.x, position.y);
        return new Car(c_pos, phi, speed, carLength);
    };
};
