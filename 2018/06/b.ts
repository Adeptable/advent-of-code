interface point { x: number, y: number }

var fs = require('fs');
var inputFile = process.mainModule.filename.match(/^(.*\\)[^\\]+\.[^\\]+$/)[1] + 'input.txt'
fs.readFile(inputFile, 'ascii', (err, data: string) => {
    if (err) {
        console.error(err);
    } else {
        var lines = data.split('\n')
            .filter(a => a !== '')
        //.filter((a, i) => i < 10)

        var size = 400
        var limit = 10000

        //var lines = ['1, 1', '1, 6', '8, 3', '3, 4', '5, 5', '8, 9']; size=12; limit=32

        var coords = lines.map(x => /^(\d+), (\d+)$/.exec(x))
            .map(x => ({ x: x[1], y: x[2] }))
            .map(c => ({ x: parseInt(c.x, 10), y: parseInt(c.y, 10), area: 0 }))

        var limit_x_min = coords.reduce((p, c) => Math.min(c.x, p), 999)
        var limit_x_max = coords.reduce((p, c) => Math.max(c.x, p), 0)
        var limit_y_min = coords.reduce((p, c) => Math.min(c.y, p), 999)
        var limit_y_max = coords.reduce((p, c) => Math.max(c.y, p), 0)

var inreg = 0
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                var p = { x: i, y: j }
                var dist = coords.map(c=>getDist(c,p)).reduce((p,c)=>p+c,0)
                if(dist<limit){
                    //console.log('found at ', dist, p)
                    inreg++;
                }
            }
        }

        function getDist(p1: point, p2: point) {
            return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)
        }

        //console.log(coords)
        console.log(inreg)
        //console.log(coords.length, limit_x_min, limit_x_max, limit_y_min, limit_y_max)
    }
});