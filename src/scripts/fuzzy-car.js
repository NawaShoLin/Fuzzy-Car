var FuzzyCar = function(painter, window) {
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

    var update = function() {
        car.move(MathHelper.degToRad(20));
    };

    var draw = function() {
        painter.addEnv(env);
        painter.addCar(car);
        painter.draw();
    };

    var mainLoop = function() {
        window.requestAnimationFrame(mainLoop);
        update();
        draw();
    };

    this.run = function() {
        mainLoop();
    };
};