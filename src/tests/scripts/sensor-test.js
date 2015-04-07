QUnit.test("Sensor Test", function(assert) {
    var pos = {x:0, y:0};
    var x3_line = new Line(Position(3, -100), Position(3, 100));
    var x4_line = new Line(Position(4, -100), Position(4, 100));
    var env = new Environment([x3_line, x4_line]);

    var OK_ERR = 1e-8;
    var PI = Math.PI;


    var senseResult = senseEnv(Position(0,0), 0, env);
    assert.ok(Math.abs(senseResult - 3) < OK_ERR, "Dist:" + senseResult);

    var xm3_line = new Line(Position(-3, -100), Position(-3, 100));
    env = new Environment([xm3_line, x4_line]);
    senseResult = senseEnv(Position(0,0), 0, env);
    assert.ok(Math.abs(senseResult - 4) < OK_ERR, "Dist:" + senseResult);

    var y1_line = new Line(Position(100, 1), Position(-100, 1));
    env = new Environment([y1_line]);
    senseResult = senseEnv(Position(0,2), -(PI/4), env);
    assert.ok(Math.abs(senseResult - Math.sqrt(2)) < OK_ERR, "Dist:" + senseResult);
});