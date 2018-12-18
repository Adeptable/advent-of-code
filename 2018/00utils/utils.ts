exports.read = read;
exports.readLines =readLines;

function read(f: (data:string) => any): void {
    var fs = require('fs');
    var inputFile = process.mainModule.filename.match(/^(.*\\)[^\\]+\.[^\\]+$/)[1] + 'input.txt'
    fs.readFile(inputFile, 'ascii', (err, data: string) => {
        if (err) {
            console.error(err);
        } else {
            var r = f(data);

            console.log(r)
        }
    });
}

function readLines(f: (data:string[]) => any): void {
    read(data => {
        var lines = data.substr(0,data.length-1).split('\n');
        return f(lines);
    })
}