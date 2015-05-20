var CatPainter = function(canvas) {
    'use strict';

    var lowLayerPainter = new Painter(canvas);
    var scale = 10;
    var blank = 100;

    var fixPosition = function(pos) {
        var x = pos.x * scale + blank;
        var y = lowLayerPainter.Height() - (pos.y * scale + blank);
        return new Position(x, y);
    };

    var addLine = function(line) {
        var fixedLine = {
            p1: fixPosition(line.p1),
            p2: fixPosition(line.p2)
        };
        lowLayerPainter.addLine(fixedLine);
    };

    var addCircle = function(circle) {
        var fixedCircle = {
            center: fixPosition(circle.center),
            radius: circle.radius * scale
        };
        lowLayerPainter.addCircle(fixedCircle);
    };

    this.addSencorLine = function(gline) {
        var line = { p1: gline.startPoint, p2: gline.endPoint };
        addLine(line);
    };

    this.addWall = function(wall) {
        var line = { p1: wall.startPoint, p2: wall.endPoint };
        addLine(line);
    };

    this.addEnv = function(env) {
        for (var i = 0; i < env.walls.length; i += 1) {
            this.addWall(env.walls[i]);
        }
    };

    this.addCar = function(car) {
        var pos = car.position();
        var phi = car.phi();

        var r = car.carLength() / 2;
        addCircle({ center:pos, radius: r });

        var frontLine = {
            p1: pos,
            p2: Position(pos.x + Math.cos(phi) * r, pos.y + Math.sin(phi) * r)
        };

        addLine(frontLine);
    };

    this.addMessage = function(msg) {
        lowLayerPainter.addMessage(msg);
    };

    this.draw = function() {
        lowLayerPainter.draw();
    };
};