var GaForNn = function(trainingData, options) {
    'use strict';

    options = options || {};

    var xfuns = [
        function(left, center, right) {
            return left - right;
        },
        function(left, center, right) {
            return center;
        }
    ];

    var numOfNeural = 2;
    var numOfInput = xfuns.length;
    var mRange = 16;
    var sigmaRange = 20;
    var weightRange = 40;

    var mStartIndex = 0;
    var sigmaStartIndex = mStartIndex + (numOfInput * numOfNeural);
    var weightStartIndex = sigmaStartIndex + numOfInput;


    var crossover = function(parent1, parent2) {
        if (parent1.length != parent2.length) {
            throw 'Number of chromosomes not match';
        }

        var crossChromosome = function(a, b) {
            var r = Math.random();
            var diff = b - a;
            return a + diff * r;
        };

        var child = [];
        for (var i = 0; i < parent1.length; i += 1) {
            child.push(crossChromosome(parent1[i], parent2[i]));
        }
        return child;
    };

    var mutate = function(cat) {
        var breadth = 0.2;

        return cat.map(function(code) {
            var r = (Math.random() * breadth * 2) - breadth;
            return code + (code * r);
        });
    };

    var wheelFromScores = function(scores) {
        var scoreSum = scores.reduce(function(a, b) {
            return a + b;
        });

        var wheel = [];
        var pre = 0;
        scores.forEach(function(score) {
            var t = (score / scoreSum) + pre;
            wheel.push(t);
            pre = t;
        });

        return wheel;
    };

    var sortedRandList = function(size) {
        var randList = [];

        for (var i = 0; i < size; i += 1) {
            randList.push(Math.random());
        }

        return randList.sort(function(a, b) {
            return a - b;
        });
    };


    var rouletteWheel = function(cats, scores, populationSize) {
        if (cats.length != scores.length) {
            throw 'Number of chromosomes not match';
        }

        var wheel = wheelFromScores(scores);
        var randList = sortedRandList(populationSize);

        var selected = [];
        var i = 0;
        randList.forEach(function(val) {
            while (wheel[i] < val && i < wheel.length - 1) {
                i += 1;
            }

            selected.push(cats[i]);
        });

        return selected;
    };

    var tournament = function(cats, scores, populationSize) {
        if (cats.length != scores.length) {
            throw 'Number of chromosomes not match';
        }

        var endIndex = cats.length - 1;
        var randIndex = function() {
            return MathHelper.IntRand(0, endIndex);
        };

        var selectOne = function() {
            var i1 = randIndex();
            var i2 = randIndex();

            return (scores[i1] > scores[i2])? cats[i1] : cats[i2];
        };

        var selected = [];
        for (var i = 0; i < populationSize; i += 1) {
            selected.push(selectOne());
        }

        return selected;
    };


    var randInRange = function(range) {
        return MathHelper.floatRand(-range, range);
    };

    var randSequence = function(range, num) {
        var seq = [];
        for (var i = 0; i < num; i += 1) {
            var ele = randInRange(range);
            seq.push(ele);
        }
        return seq;
    };

    var randCat = function() {
        var mSequnce = randSequence(mRange, numOfNeural * numOfInput);
        var sigmas = randSequence(sigmaRange, numOfNeural);
        var weights = randSequence(weightRange, numOfNeural);

        return mSequnce.concat(sigmas).concat(weights);
    };

    var randCats = function(num) {
        var cats = [];
        for (var i = 0; i < num; i += 1) {
            cats.push(randCat());
        }
        return cats;
    };


    var msFromGene = function(gene) {
        var ms = [];
        var gIndex = 0;
        for (var i = 0; i < numOfNeural; i += 1) {
            var m = [];
            for (var j = 0; j < numOfInput; j += 1) {
                gIndex += 1;
                m.push(gene[gIndex]);
            }
            ms.push(m);
        }

        return ms;
    };

    var sigmasFromGene = function(gene) {
        return gene.slice(sigmaStartIndex, weightStartIndex);
    };

    var weightsFromGene = function(gene) {
        return gene.slice(weightStartIndex);
    };

    var score = function(gene) {
        var ms = msFromGene(gene);
        var sigmas = sigmasFromGene(gene);
        var weights = weightsFromGene(gene);

        var F = NNDriver(xfuns, ms, sigmas, weights);
        var errorSum = 0;

        trainingData.forEach(function(datum) {
            var val = F(datum.left, datum.center, datum.right);
            var expected = datum.theta;
            errorSum += Math.abs(val - expected);
        });

        var avgError = errorSum / trainingData.length;
        return 1 / avgError;
    };

    var codeRanges = (function() {
        var mRanges = [];
        var i;
        for (i = 0; i < sigmaStartIndex; i += 1) {
            mRanges.push([-mRange, mRange]);
        }

        var sigmaRanges = [];
        for (i = 0; i < numOfInput; i += 1) {
            sigmaRanges.push([-sigmaRange, sigmaRange]);
        }

        var weightRanges = [];
        for (i = 0; i < numOfInput; i += 1) {
            weightRanges.push([-weightRange, weightRange]);
        }

        return mRanges.concat(sigmaRanges).concat(weightRanges);
    })();

    return ((function() {
        var log = [];
        var logFun = options.logFun || function(info) {
            console.log('best:' + info.bestScore + ' - it:' + info.iteration);
            log.push(info);
        };

        var selectionFuns = {
            'roulette-wheel': rouletteWheel,
            'tournament': tournament
        };

        var funs = {
            scoreFun: score,
            selectFun: selectionFuns[options.selection] || rouletteWheel,
            crossoverFun: crossover,
            mutationFun: mutate,
            logFun: logFun
        };


        var p = options['p'] || 10000;
        var initP = options['init-p'] || p * 0.8;

        var params = {
            populationSize: p,
            maxIteration: options['max-it'] || 100,
            mutationRate: options['pm'] || 0.1,
            crossoverRate: options['pc'] || 0.2,
            codeRanges: codeRanges,
            endingScore: (1 / 0.05),
            logFrequency: options['log-freq'] || 10
        };

        var ga = GA(funs, params);
        var initCats = randCats(initP);

        var bestCat = ga(initCats);
        return {
            ms: msFromGene(bestCat),
            sigmas: sigmasFromGene(bestCat),
            weights: weightsFromGene(bestCat)
        };
    })());
};