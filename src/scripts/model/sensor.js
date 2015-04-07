/**
 * @return {float} - distance to closest bar, null if not found
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
 * @param {float} alpha - the radian between sensor and car front
 */
var Sensor = function(car, env, alpha) {
    /**
     * @return {float} - distance to closest bar, null if not found
     */
    this.distToBar = function() {
        return senseEnv(car.position(), car.phi() + alpha, env);
    };
};