var GA = function(funs, params) {
    var scoreFun, selectFun, crossoverFun, mutationFun, logFun;
    var populationSize, maxIteration, mutationRate, crossoverRate, codeRanges, endingScore, logFrequency;

    var init = function() {
        populationSize = params.populationSize;
        maxIteration = params.maxIteration;
        mutationRate = params.mutationRate;
        crossoverRate = params.crossoverRate;
        codeRanges = params.codeRanges;
        endingScore = params.endingScore;
        logFrequency = params.logFrequency;

        scoreFun = funs.scoreFun;
        selectFun = funs.selectFun;
        crossoverFun = funs.crossoverFun;
        mutationFun = funs.mutationFun;
        logFun = funs.logFun;
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

    var bestOfScore = function(scores) {
        return Math.max.apply(null, scores);
    };

    var goodEnough = function(score) {
        if (typeof(endingScore) === 'undefined' || endingScore === null) {
            return false;
        } else {
            return score >= endingScore;
        }
    };

    var log = function(bestScore, iteration) {
        logFun({bestScore: bestScore, iteration: iteration});
    };

    var normalLog = function(bestScore, iteration) {
        if (logFun && logFrequency && (iteration % logFrequency === 0)) {
            log(bestScore, iteration);
        }
    };

    var endingLog = function(bestScore, iteration) {
        if (logFun) {
            iteration = min(iteration, maxIteration);
            log(bestScore, iteration);
        }
    };

    var fixToRange = function(cats) {
        cats.forEach(function(gene) {
            for (var i = 0; i < gene.length; i += 1) {
                if (gene[i] < codeRanges[i][0]) {
                    gene[i] = codeRanges[i][0];
                } else if (gene[i] > codeRanges[i][1]) {
                    gene[i] = codeRanges[i][1];
                }
            }
        });
        return cats;
    };

    return function(cats) {
        var scores, bestScore, i;
        for (i = 0; i < maxIteration; i++) {
            scores = computeScores(cats);
            cats = selectFun(cats, scores, populationSize);

            var crossoverChildren = fixToRange(crossover(cats, scores));
            cats = cats.concat(crossoverChildren);

            var mutated = fixToRange(mutate(cats));
            cats = cats.concat(mutated);

            bestScore = bestOfScore(scores);
            normalLog(bestScore, i);

            if (goodEnough(bestScore)) {
                break;
            }
        }

        endingLog();
        return cats;
    };
};
