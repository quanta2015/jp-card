var path = require('path');
var fs = require('fs');
var inputFile =  'data.md';
var outFile = 'ret.json'


var data = fs.readFileSync(inputFile,'utf-8').split(/[\n]/)
var ret = []

data.forEach(function(e){
	var item = {
      "ln": "0",
      "base": e.split('・')[0].split('　')[0],
      "hiragana": null,
      "ex": null
    }
	base = e.split('・')[0].split('　')[0]
	hg   = e.split('・')[0].split('　')[1]

	if(hg.split('/').length>1) {
		hs = []
		_hg = hg.split('/')
		_hg.forEach(function(h){
			hs.push(h)
		})
		hg = hs;
	}

	ex   = e.split('・')[1].split('/')
	exList = []
	ex.forEach(function(ei) {
		var exNode = {
          "base": ei.split('　')[0],
          "hiragana": ei.split('　')[1],
          "chinese": ei.split('　')[2]
        }
        exList.push(exNode)
	})
	
	item.hiragana = hg;
	item.ex = exList;
	ret.push(item)
})

// console.log(ret)

fs.writeFileSync(outFile, JSON.stringify(ret));
