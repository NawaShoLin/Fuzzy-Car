var NNDriver = function(xfuns, ms, sigmas, weights) {
    'use strict';

    if (!(ms.length == sigmas.length &&
        sigmas.length == weights.length)) {
        throw "Arguments do not match.";
    }

    var phiOfI = function(i, x) {
        return phi(x, ms[i], sigmas[i]);
    };

    var phi = function(x, m, sigma) {
        if (x.length != m.length) {
            throw "vector 'x' do not match vector 'm'";
        }

        // s = (|x - m| ^ 2)
        var s = 0;
        for (var i = 0; i < x.length; i += 1) {
            var diff = x[i] - m[i];
            s += diff * diff;
        }

        return Math.exp(-(s / (2 * sigma * sigma)));
    };

    // F()
    return function() {
        // x is a vector : (x1, x2, ... ,xp)
        // args to f is sensor inputs
        var x = [];
        var args = arguments;
        xfuns.forEach(function(xfun) {
            x.push(xfun.apply(null, args));
        });

        var sum = 0;
        weights.forEach(function(weight, i) {
            sum += phiOfI(i, x) * weight;
        });
        return sum;
    };
};
