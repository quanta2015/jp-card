var path = require('path');
var fs = require('fs');

var ret = []
var inputFile =  'word.md';
var outFile   =  'ret.json'
var data = fs.readFileSync(inputFile,'utf-8').split(/[\n]/)

data.forEach(function(e){
	var item = {
      "ln": "0",
      "type": "N4",
      "base": e.split('　')[0],
      "hiragana": e.split('　')[1],
      "chinese": e.split('　')[2]
    }
	ret.push(item)
})

// console.log(ret)
fs.writeFileSync(outFile, JSON.stringify(ret));
