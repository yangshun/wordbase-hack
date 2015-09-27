var fn = null;

angular.module('wordBaseHack', [])
    .controller('wordBaseController', function () {

    var that = this;

    // SERIALISTS missing

    that.puzzle = [
        'GRIHSMGIEY',
        'IPASKEAOTA',
        'AVLIMRPRSM',
        'EQSRAPESCH',
        'RAUETGUHRE',
        'SDECMPEUON',
        'OSDREANDED',
        'METSTOLEAR',
        'CIANEUPGSA',
        'LUIERMTNIS',
        'ALEGSHOZCI',
        'ESASNEGEAD',
        'CRYOENDGRT'];

    that.startFromBottom = false;

    var WIDTH = that.puzzle[0].length;
    var HEIGHT = that.puzzle.length;

    for (var i = 0; i < HEIGHT; i++) {
        that.puzzle[i] = that.puzzle[i].split('');
        for (var j = 0; j < WIDTH; j++) {
            that.puzzle[i][j] = {
                letter: that.puzzle[i][j],
                highlighted: false
            }
        }
    }

    function init (dictionary, formableWords) {
        that.dictionary = dictionary;
        that.formableWords = formableWords
        console.log('READY!');
    }

    that.words = [];

    that.getWordFromSequence = function (sequence) {
        return sequence.map(function (object) {
            return object.letter;
        }).join('');
    };

    function resetHighlighting () {
        for (var i = 0; i < HEIGHT; i++) {
            for (var j = 0; j < WIDTH; j++) {
                that.puzzle[i][j].highlighted = false;
            }
        }
    }

    that.highlightLetters = function (sequence) {
        resetHighlighting();
        sequence.forEach(function (item) {
            that.puzzle[item.row][item.col].highlighted = true;
        });
    }

    that.findWordsFromCell = function (i, j) {
        resetHighlighting();
        var words = [];
        var count = 0;
        function traverse(currPuzzle, currSeq, i, j) {
            count++;
            if (i < 0 || i >= HEIGHT ||
                j < 0 ||
                j >= WIDTH) {
                return;
            }
            if (currPuzzle[i][j] === '*') {
                return;
            }
            currSeq.push({
                letter: currPuzzle[i][j].letter,
                row: i,
                col: j
            });
            currPuzzle[i][j].letter = '*';
            var puzzle = _.cloneDeep(currPuzzle);
            var currentWord = that.getWordFromSequence(currSeq);
            if (that.dictionary[currentWord]) {
                words.push(currSeq);
            }
            if (!that.formableWords[currentWord]) {
                return;
            }
            traverse(_.cloneDeep(puzzle), _.cloneDeep(currSeq), i - 1, j - 1);
            traverse(_.cloneDeep(puzzle), _.cloneDeep(currSeq), i - 1, j);
            traverse(_.cloneDeep(puzzle), _.cloneDeep(currSeq), i - 1, j + 1);
            traverse(_.cloneDeep(puzzle), _.cloneDeep(currSeq), i, j - 1);
            traverse(_.cloneDeep(puzzle), _.cloneDeep(currSeq), i, j + 1);
            traverse(_.cloneDeep(puzzle), _.cloneDeep(currSeq), i + 1, j - 1);
            traverse(_.cloneDeep(puzzle), _.cloneDeep(currSeq), i + 1, j);
            traverse(_.cloneDeep(puzzle), _.cloneDeep(currSeq), i + 1, j + 1);
        }

        traverse(_.cloneDeep(that.puzzle), [], i, j);

        words.sort(function (a, b) {
            return b.length - a.length;
        });

        that.words = words;
    }

    that.computeProgress = function (word) {
        var startRow = word[0].row;
        var maxDistance = 0;
        var minDistance = 0;
        word.forEach(function (obj) {
            var difference = startRow - obj.row;
            var differenceA = Math.max(difference, 0);
            if (differenceA > maxDistance) {
                maxDistance = differenceA;
            }
            var differenceB = Math.min(difference, 0);
            if (differenceB < minDistance) {
                minDistance = differenceB;
            }
        });
        return Math.abs(that.startFromBottom ? maxDistance : minDistance);
    }

    $(function () {
        $.get('data/words.json', function (data) {
            var dictionary = {};
            var formableWords = {};
            data.forEach(function (word) {
                dictionary[word] = true;
                for (var i = 1; i < word.length; i++) {
                    formableWords[word.slice(0, i)] = true;
                }
            });
            init(dictionary, formableWords);
        });
    });
});
