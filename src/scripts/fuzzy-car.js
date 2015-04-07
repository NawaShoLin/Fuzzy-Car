var FuzzyCar = function(painter, window, historyMod) {
    var defaultCar = function() {
        return new Car();
    };
    var defaultEvn = function() {
        var env = new Environment();
        var a = Position(-6, -6);
        var b = Position(6, -6);
        var c = Position(6, 10);
        var d = Position(30, 10);
        var e = Position(30, 40);
        var f = Position(18, 40);
        var g = Position(18, 22);
        var h = Position(-6, 22);

        env.addWall(new Line(a, b));
        env.addWall(new Line(b, c));
        env.addWall(new Line(c, d));
        env.addWall(new Line(d, e));
        env.addWall(new Line(e, f));
        env.addWall(new Line(f, g));
        env.addWall(new Line(g, h));
        env.addWall(new Line(h, a));

        return env;
    };

    var car = defaultCar();
    var env = defaultEvn();

    var leftSensor = new Sensor(car, env, -(Math.PI/4));
    var centerSensor = new Sensor(car, env, 0);
    var rightSensor = new Sensor(car, env, Math.PI/4);

    var drive = Drive(leftSensor, centerSensor, rightSensor);

    historyMod = historyMod || false;
    var histroyCars = [];

    var drawHistoryCars = function() {
        histroyCars.forEach(function(h_car){
            painter.addCar(h_car);
        });
    };

    var update = function() {
        histroyCars.push(car.clone());
        car.move(drive());
    };

    var draw = function() {
        painter.addEnv(env);
        painter.addCar(car);

        if (historyMod) {
            drawHistoryCars();
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