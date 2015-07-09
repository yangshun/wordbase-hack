var fn = null;

angular.module('wordBaseHack', [])
    .controller('wordBaseController', function () {
    
    var that = this;
    
    // that.puzzle = [
    //     'DINGVLEVIW',
    //     'BSRMIRCIOT',
    //     'IAECADYMHN',
    //     'ONTRTNREDE',
    //     'RDSEOANTMR',
    //     'ICENIMOSNB',
    //     'UEWRATRAOA',
    //     'RTSPRUICLR',
    //     'USPAGISITO',
    //     'EBINENCNIM',
    //     'LUTGNGOEAC',
    //     'ROAIARETRO',
    //     'HUMSKNIHNA'];

    // that.puzzle = [
    //     'HPALBNQRAB',
    //     'ABLUWBUHEO',
    //     'TIRAEOSESW',
    //     'GOTRVTOHEH',
    //     'NYIPERGIRB',
    //     'LIGNTGNLOS',
    //     'FRSEOIAIPE',
    //     'TAGXRSTCSR',
    //     'NDSNTHYSIE',
    //     'EAHIPTGAWT',
    //     'INKYANETES',
    //     'OCNTEMUMRA',
    //     'DIGILNAPLP'];

    that.puzzle = [
        'HYCSTVAIUG',
        'CSANEIRALR',
        'TOSGLRWSES',
        'ACPIMOSXAC',
        'NURACTEOHA',
        'TDONBARCRS',
        'OINEXSCSQL',
        'NLIRNISAUE',
        'IDENTAEDNS',
        'EFUDSRVLIG',
        'WSKEGNUGOV',
        'LOGOVEIVAO',
        'ALDCRSETPS'];
    
    var WIDTH = that.puzzle[0].length;
    var HEIGHT = that.puzzle.length;

    function init (dictionary, formableWords) {
        that.dictionary = dictionary;
        that.formableWords = formableWords

        for (var i = 0; i < that.puzzle.length; i++) {
            that.puzzle[i] = that.puzzle[i].split('');
        }
        console.log('READY!');
    }

    that.words = [];

    function getWordFromSequence (sequence) {
        return sequence.map(function (object) {
            return object.letter;
        }).join('');
    }

    that.findWordsFromCell = function (i, j) {
        var words = [];
        var count = 0;
        function traverse(currPuzzle, currWord, i, j) {
            count++;
            if (i < 0 || i >= HEIGHT || 
                j < 0 || 
                j >= WIDTH) {
                return;
            }
            if (currPuzzle[i][j] === '*') {
                return;
            }
            currWord += currPuzzle[i][j];
            currPuzzle[i][j] = '*';
            var puzzle = _.cloneDeep(currPuzzle);
            if (that.dictionary[currWord]) {
                words.push(currWord);
            }
            if (!that.formableWords[currWord]) {
                return;
            }
            traverse(puzzle, _.cloneDeep(currWord), i - 1, j - 1);
            traverse(puzzle, _.cloneDeep(currWord), i - 1, j);
            traverse(puzzle, _.cloneDeep(currWord), i - 1, j + 1);
            traverse(puzzle, _.cloneDeep(currWord), i, j - 1);
            traverse(puzzle, _.cloneDeep(currWord), i, j + 1);
            traverse(puzzle, _.cloneDeep(currWord), i + 1, j - 1);
            traverse(puzzle, _.cloneDeep(currWord), i + 1, j);
            traverse(puzzle, _.cloneDeep(currWord), i + 1, j + 1);
        }

        traverse(_.cloneDeep(that.puzzle), [], i, j);

        words.sort(function (a, b) {
            return b.length - a.length;
        });
        console.log('DONE', count, words);
        that.words = words;
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
