var FuzzyCar = function(car, env, painter, historyMod) {
    var leftSensor = new Sensor(car, env, -(Math.PI/4));
    var centerSensor = new Sensor(car, env, 0);
    var rightSensor = new Sensor(car, env, Math.PI/4);

    var drive = Drive(leftSensor, centerSensor, rightSensor);

    historyMod = historyMod || false;
    var historyCars = [];

    var frontLine;
    var leftLine, rightLine;

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
        if (checkSuccess()) {
            success = true;
        } else {
            historyCars.push(car.clone());
            car.move(drive());

            frontLine = centerSensor.getSenceLine();
            leftLine = leftSensor.getSenceLine();
            rightLine = rightSensor.getSenceLine();
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
        }

        painter.draw();
    };

    var mainLoop = function() {
        window.setTimeout(mainLoop, 50);
        update();
        draw();
    };

    this.run = function() {
        mainLoop();
    };
};