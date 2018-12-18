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

//        var lines = ['1, 1', '1, 6', '8, 3', '3, 4', '5, 5', '8, 9']

        var coords = lines.map(x => /^(\d+), (\d+)$/.exec(x))
            .map(x => ({ x: x[1], y: x[2] }))
            .map(c => ({ x: parseInt(c.x, 10), y: parseInt(c.y, 10), area: 0 }))

        var limit_x_min = coords.reduce((p, c) => Math.min(c.x, p), 999)
        var limit_x_max = coords.reduce((p, c) => Math.max(c.x, p), 0)
        var limit_y_min = coords.reduce((p, c) => Math.min(c.y, p), 999)
        var limit_y_max = coords.reduce((p, c) => Math.max(c.y, p), 0)

        var size = 400

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                var found = closest({ x: i, y: j })
                if (found) {
                    if (i == 0 || i == size - 1 || j == 0 || j == size - 1) {
                        found.area = NaN
                    } else {
                        found.area++
                    }
                }
            }
        }

        function closest(p: point) {
            var dis = coords.map(c => ({ c: c, dist: getDist(c, p) }))
                .sort((x, y) => x.dist - y.dist)
            //console.log(p, dis)
            if (dis[0].dist < dis[1].dist) {
                return dis[0].c
            } else {
                return null
            }
        }

        function getDist(p1: point, p2: point) {
            return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)
        }

        //console.log(coords)
        console.log(coords.map(c => c.area).filter(x=> ! Number.isNaN(x)).sort((x, y) => y - x)[0])
        //console.log(coords.length, limit_x_min, limit_x_max, limit_y_min, limit_y_max)
    }
});