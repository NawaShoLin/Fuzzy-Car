var AutoCar = function(car, env, painter, driveFun, logger, options) {
    'use strict';

    var leftSensor = new Sensor(car, env, -(Math.PI/4));
    var centerSensor = new Sensor(car, env, 0);
    var rightSensor = new Sensor(car, env, Math.PI/4);

    options = options || {};
    var historyMod = options.historyMod || false;
    var historyCars = [];
    var timePerClock = options.fps ? (1000 / options.fps) : (1000 / 30);

    var frontLine;
    var leftLine, rightLine;

    var drawHistoryCars = function() {
        historyCars.forEach(function(h_car){
            painter.addCar(h_car);
        });
    };

    var success = false;
    var endFlag = false;

    var checkSuccess = function() {
        return car.position().y >= env.endY;
    };

    var update = function() {
        var updateSensorLines = function () {
            frontLine = centerSensor.getSenceLine();
            leftLine = leftSensor.getSenceLine();
            rightLine = rightSensor.getSenceLine();
        };

        var moveCar = function() {
            var leftDist = leftSensor.distToBar();
            var centerDist = centerSensor.distToBar();
            var rightDist = rightSensor.distToBar();
            var nextTheta = Drive(leftDist, centerDist, rightDist);

            car.move(nextTheta);

            logger.path.push({
                theta: nextTheta,
                left: leftDist,
                center: centerDist,
                right: rightDist
            });
        };


        if (checkSuccess()) {
            success = true;
        } else {
            historyCars.push(car.clone());

            moveCar();
            updateSensorLines();
        }
    };

    var draw = function() {
        painter.addEnv(env);
        painter.addCar(car);
        painter.addSencorLine(frontLine);
        painter.addSencorLine(leftLine);
        painter.addSencorLine(rightLine);

        if (historyMod) {
            drawHistoryCars();
        }

        if (success) {
            painter.addMessage("Success!");
            endFlag = true;
        }

        painter.draw();
    };

    var mainLoop = function() {
        update();
        draw();

        if (!endFlag) {
            window.setTimeout(mainLoop, timePerClock);
        }
    };

    this.run = function() {
        mainLoop();
    };
};
