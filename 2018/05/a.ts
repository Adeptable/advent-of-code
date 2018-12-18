var fs = require('fs');
var inputFile = process.mainModule.filename.match(/^(.*\\)[^\\]+\.[^\\]+$/)[1] + 'input.txt'
fs.readFile(inputFile, 'ascii', (err, data: string) => {
    if (err) {
        console.error(err);
    } else {

        var poly = data.trimRight()
//            .substr(0, 100)

        var len = 0;

        var init = 'a'.charCodeAt(0)
        var chars = [...Array(26).keys()].map((v, i) => init + i).map(v => String.fromCharCode(v))

        var lowUp = new RegExp(chars.map(v => v + v.toUpperCase()).join('|'))
        var upLow = new RegExp(chars.map(v => v.toUpperCase() + v).join('|'))
        console.log(lowUp)

        while (len != poly.length) {

            len = poly.length

            //            console.log(poly)
            //poly = poly.replace('cC','')
            poly = poly.replace(lowUp, '')
            //          console.log(poly)
            poly = poly.replace(upLow, '')

            //console.count('round')            
        }

        console.log()
        console.log(poly)
        console.log(poly.length)
    }
});