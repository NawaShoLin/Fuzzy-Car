var GA = function(funs, params) {
    var scoreFun, selectFun, crossoverFun, mutationFun;
    var populationSize, maxIteration, mutationRate, crossoverRate, codeRanges, endingScore;

    var init = function() {
        populationSize = params.populationSize;
        maxIteration = params.maxIteration;
        mutationRate = params.mutationRate;
        crossoverRate = params.crossoverRate;
        codeRanges = params.codeRanges;
        endingScore = params.endingScore;

        scoreFun = funs.scoreFun;
        selectFun = funs.selectFun;
        crossoverFun = funs.crossoverFun;
        mutationFun = funs.mutationFun;
    };

    var checkEssentials = function () {
        var essentialFuns = [scoreFun, selectFun, crossoverFun, mutationFun];
        var essentialParams = [populationSize, maxIteration, mutationRate, crossoverRate, codeRanges];

        var essentials = essentialFuns.concat(essentialParams);
        essentials.forEach(function (e) {
            if (typeof(e) === 'undefined' || e === null) {
                throw "Missing arguments";
            }
        });
    };

    init();
    checkEssentials();


    var crossover = function(cats) {
        var num = Math.floor(populationSize * crossoverRate);
        var children = [];
        for (var i = 0; i < num; i += 1) {
            var i1 = MathHelper.IntRand(0, cats.length - 1);
            var i2 = MathHelper.IntRand(0, cats.length - 1);
            var child = crossoverFun(cats[i1], cats[i2]);
            children.push(child);
        }
        return children;
    };

    var mutate = function(cats) {
        var num = Math.floor(populationSize * mutationRate);
        var mutatedClones = [];
        for (var i = 0; i < num; i += 1) {
            var r = MathHelper.IntRand(0, cats.length - 1);
            mutatedClones.push(mutationFun(cats[r]));
        }
        return mutatedClones;
    };

    var computeScores = function(cats) {
        return cats.map(scoreFun);
    };

    var goodEnough = function(scores) {
        if (typeof(endingScore) === 'undefined' || endingScore === null) {
            return false;
        }

        var best = Math.max.apply(null, scores);
        return best >= endingScore;
    };

    return function(cats) {
        var scores;
        for (var i = 0; i < maxIteration; i++) {
            scores = computeScores(cats);
            cats = selectFun(cats, scores, populationSize);
            cats = cats.concat(crossover(cats, scores));
            cats = cats.concat(mutate(cats));

            if (goodEnough(scores)) {
                break;
            }
        }
    };
};
