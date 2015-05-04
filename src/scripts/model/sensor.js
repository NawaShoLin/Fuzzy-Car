/**
 * @return {number} - distance to closest bar, null if not found
 */
var senseEnv = function(pos, phi, env) {
    var ray = new Ray(pos, phi);

    var cPoints; // crossover points
    cPoints = env.walls.map(function(wall) {
        return ray.crossoverPoint(wall);
    });
    cPoints = cPoints.filter(function(v) {
        return v !== null;
    });

    if (cPoints.length === 0) {
        return null;
    }

    var minDist = MathHelper.Distance(pos, cPoints[0]);
    cPoints.forEach(function(cPoint) {
        var d = MathHelper.Distance(pos, cPoint);
        if (d < minDist) {
            minDist = d;
        }
    });

    return minDist;
};


/**
 * @param {object} car  - the car
 * @param {object} env - the environment
 * @param {number} alpha - the radian between sensor and car front
 */
var Sensor = function(car, env, alpha) {
    var self = this;

    /**
     * @return {number} - distance to closest bar, null if not found
     */
    this.distToBar = function() {
        return senseEnv(car.position(), car.phi() + alpha, env);
    };

    this.getSenceLine = function() {
        var dist = self.distToBar();
        var theta = car.phi() + alpha;
        var p1 = car.position();

        var x2 = p1.x + Math.cos(theta) * dist;
        var y2 = p1.y + Math.sin(theta) * dist;
        var p2 = Position(x2, y2);

        return new Line(p1, p2);
    }
};