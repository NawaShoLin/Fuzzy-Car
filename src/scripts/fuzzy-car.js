var log = function(msg) {
    console.log(msg);
};

var FuzzyCar = function(car, env, painter, historyMod) {
    var leftSensor = new Sensor(car, env, -(Math.PI/4));
    var centerSensor = new Sensor(car, env, 0);
    var rightSensor = new Sensor(car, env, Math.PI/4);

    historyMod = historyMod || false;
    var historyCars = [];

    var frontLine;
    var leftLine, rightLine;

    var tDatas = []

    var drawHistoryCars = function() {
        historyCars.forEach(function(h_car){
            painter.addCar(h_car);
        });
    };

    var success = false;

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

            tDatas.push({
                theta: nextTheta,
                left: leftDist,
                center: centerDist,
                right: rightDist
            });

            log("Theta: " + nextTheta);
            log("L/C/R: " + leftDist + ", " + centerDist + ", " + rightDist);
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
            runGA();
        }

        painter.draw();
    };

    var mainLoop = function() {
        window.setTimeout(mainLoop, 50);
        update();
        draw();
    };

    var runGA = function() {
        var ga = GaForNn(tDatas);
    };

    this.run = function() {
        mainLoop();
    };
};