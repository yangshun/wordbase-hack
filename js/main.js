var fn = null;

angular.module('wordBaseHack', [])
    .controller('wordBaseController', function () {
    var wordBaseController = this;
    wordBaseController.puzzle = [
        'DINGVLEVIW',
        'BSRMIRCIOT',
        'IAECADYMHN',
        'ONTRTNREDE',
        'RDSEOANTMR',
        'ICENIMOSNB',
        'UEWRATRAOA',
        'RTSPRUICLR',
        'USPAGISITO',
        'EBINENCNIM',
        'LUTGNGOEAC',
        'ROAIARETRO',
        'HUMSKNIHNA'];
    var WIDTH = wordBaseController.puzzle[0].length;
    var HEIGHT = wordBaseController.puzzle.length;

    function init (dict) {
        dictionary = dict;

        for (var i = 0; i < wordBaseController.puzzle.length; i++) {
            wordBaseController.puzzle[i] = wordBaseController.puzzle[i].split('');
        }
    }

    wordBaseController.words = [];

    wordBaseController.findWordsFromCell = function (i, j) {
        var words = [];
        function traverse(currPuzzle, currWord, i, j) {
            if (i < 0 || i >= HEIGHT || j < 0 || j >= WIDTH || currWord.length > 9) {
                return;
            }
            if (currPuzzle[i][j] === '*') {
                return;
            }
            currWord += currPuzzle[i][j];
            currPuzzle[i][j] = '*';
            var puzzle = _.cloneDeep(currPuzzle);
            if (dictionary[currWord]) {
                words.push(currWord);
            }
            traverse(puzzle, currWord, i - 1, j - 1);
            traverse(puzzle, currWord, i - 1, j);
            traverse(puzzle, currWord, i - 1, j + 1);
            traverse(puzzle, currWord, i, j - 1);
            traverse(puzzle, currWord, i, j + 1);
            traverse(puzzle, currWord, i + 1, j - 1);
            traverse(puzzle, currWord, i + 1, j);
            traverse(puzzle, currWord, i + 1, j + 1);
        }

        traverse(_.cloneDeep(wordBaseController.puzzle), '', i, j);

        words.sort(function (a, b) {
            return b.length - a.length;
        });
        console.log('DONE', words);
        wordBaseController.words = words;
    }

    $(function () {
        $.get('data/words.json', function (data) {
            var dictionary = {};
            data.forEach(function (word) {
                dictionary[word] = true;
            });
            init(dictionary);
        });
    });
});
