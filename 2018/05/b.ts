var fs = require('fs');
var inputFile = process.mainModule.filename.match(/^(.*\\)[^\\]+\.[^\\]+$/)[1] + 'input.txt'
fs.readFile(inputFile, 'ascii', (err, data: string) => {
    if (err) {
        console.error(err);
    } else {

        var orig = data.trimRight()
                    //.substr(0, 100)

        var init = 'a'.charCodeAt(0)
        var chars = [...Array(26).keys()].map((v, i) => init + i).map(v => String.fromCharCode(v))

        var lowUp = new RegExp(chars.map(v => v + v.toUpperCase()).join('|'),'g')
        var upLow = new RegExp(chars.map(v => v.toUpperCase() + v).join('|'),'g')
        //console.log(lowUp)
//console.log(orig)
        var re = [];
        chars.forEach(element => { 
            var r = new RegExp(element + '|' + element.toUpperCase(),'g')
            var poly = orig.replace(r,'')
            //console.log(r, poly)
            var len = 0;
            while (len != poly.length) {
                len = poly.length
                poly = poly.replace(lowUp, '')
                poly = poly.replace(upLow, '')
            }
            var x = { chr: element, len: poly.length }
            console.log(x)
            re.push(x)
        });

        var x = re.sort((x, y) => x.len - y.len)[0]

        console.log()
        console.log(x)
    }
});