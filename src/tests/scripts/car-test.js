QUnit.test("Car Test", function(assert) {
    var car = new Car();

    // Defaults
    assert.equal(car.position().x, 0);
    assert.equal(car.position().y, 0);
    assert.equal(car.phi(), Math.PI / 2);

    var nextPos = car.nextPosition(0);
    var nextPhi = car.nextPhi(0);
    assert.ok(Math.abs(nextPos.x - 0) < 1e-8);
    assert.ok(Math.abs(nextPos.y - 1) < 1e-8);
    assert.ok(Math.abs(nextPhi - Math.PI / 2) < 1e-8);
});