var fs = require('fs');
var inputFile = process.mainModule.filename.match(/^(.*\\)[^\\]+\.[^\\]+$/)[1] + 'input.txt'
fs.readFile(inputFile, 'ascii', (err, data: string) => {
    if (err) {
        console.error(err);
    } else {
        var exdata = `position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>
`
        var logFrom = 1050
        var runTo = 10100
            //data = exdata
        var inp = data.split('\n')
            .filter(x => x != '')
            .map(x => /^position=<\s*([-\d]+),\s*([-\d]+)> velocity=<\s*([-\d]+),\s*([-\d]+)>$/.exec(x))
            .map(x => ({ pos: { x: parseInt(x[1], 10), y: parseInt(x[2], 10) }, vel: { x: parseInt(x[3], 10), y: parseInt(x[4], 10) } }))

        function getSiz() { return inp.reduce((p, c) => ({ min: { x: Math.min(p.min.x, c.pos.x), y: Math.min(p.min.y, c.pos.y) }, max: { x: Math.max(p.max.x, c.pos.x), y: Math.max(p.max.y, c.pos.y) } }), { min: { x: inp[0].pos.x, y: inp[0].pos.y }, max: { x: inp[0].pos.x, y: inp[0].pos.y } }) }
        //var siz = inp.reduce((p, c) => ({ min: { x: Math.min(p.min.x, c.pos.x), y: Math.min(p.min.y, c.pos.y) }, max: { x: Math.max(p.max.x, c.pos.x), y: Math.max(p.max.y, c.pos.y) } }), { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } })
        var siz = getSiz();

        //console.log(siz)
        //return;

        function moveb() {
            inp.forEach(x => {
                x.pos.x -= x.vel.x;
                x.pos.y -= x.vel.y
            })
        }

        function move() {
            inp.forEach(x => {
                x.pos.x += x.vel.x;
                x.pos.y += x.vel.y
            })
        }

        function show() {
            console.log()
            for (let ii = siz.min.y; ii <= siz.max.y; ii++) {
                var line = ' '.repeat(siz.max.x - siz.min.x)
                inp.filter(p => p.pos.y == ii).map(p => p.pos.x - siz.min.x).forEach(p => { line = line.substring(0, p) + '#' + line.substring(p + 1) })
                console.log(line)
            }
            console.log()
        }

        function area() {
            let s = getSiz()
            return (s.max.x - s.min.x) * (s.max.y - s.min.y)
        }

        var a = area()

        /*for (let index = 0; index < runTo; index++) {
            if (index > logFrom) {
                //show()
            }
            move()
        }*/
        var moves = 0
        var found = false;
        while (!found) {
            move()
            moves++;
            var a2 = area();
            found = (a2 > a)
            a = a2;
        }

moveb()
siz = getSiz()

show()

        console.log(a, moves, siz)
        //console.log(inp)
    }
});