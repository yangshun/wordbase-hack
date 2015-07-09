var fs = require('fs');

fs.readFile('../data/Word-List.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var words = data.split('\n').map(function (word) {
    return word.replace('\r', '');
  });
  var outputFilename = '../data/words.json';
  fs.writeFile(outputFilename, JSON.stringify(words), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
  });
});
