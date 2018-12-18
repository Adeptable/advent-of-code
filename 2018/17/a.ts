import { unwatchFile } from "fs";

var utils = require('../00utils/utils')

utils.readLines((data: string[]) => {

    let exdata = `x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504`.split('\n')

    //data = exdata;

    var clay: ({ x: number, y: range } | { x: range, y: number })[] = data.map(x => /^(x|y)\=(.+)\, (x|y)\=(.+)\.\.(.+)$/.exec(x))
        .map(r => ({ isYRange: r[1] === 'x', a: parseInt(r[2], 10), range: { start: parseInt(r[4], 10), end: parseInt(r[5], 10) } }))
        .map(r => r.isYRange ? { x: r.a, y: r.range } : { x: r.range, y: r.a })

    type range = { start: number, end: number }
    type cell = '#' | '.' | '|' | '~' | '+'
    var map: cell[][] = [];

    function lim(as: (number | range)[], fn: (a: number, b: number) => number, out: number) {
        return as.map(a => typeof (a) === 'number' ? a : fn(a.start, a.end)).reduce(fn, out)
    }

    var offset = lim(clay.map(r => r.x), (a, b) => Math.min(a, b), Number.POSITIVE_INFINITY)

    clay = clay.map(r => typeof (r.x) === 'number' ? { x: r.x - offset + 1, y: <range>r.y } : { x: <range>{ start: r.x.start - offset + 1, end: r.x.end - offset + 1 }, y: <number>r.y })

    var miny = lim(clay.map(r => r.y), (a, b) => Math.min(a, b), Number.POSITIVE_INFINITY)
    var maxy = lim(clay.map(r => r.y), (a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY)
    var minx = lim(clay.map(r => r.x), (a, b) => Math.min(a, b), Number.POSITIVE_INFINITY)
    var maxx = lim(clay.map(r => r.x), (a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY)

    var map: cell[][] = [...Array.from({ length: maxy + 1 }).keys()].map(x =>
        [...Array.from({ length: maxx + 1 }).keys()]
            .map(x => <cell>'.')
    )

    type point = { x: number, y: number }


    function set(map: cell[][], p: point, c: cell) {
        try {
            map[p.y][p.x] = c
        } catch (error) {
            throw 'cannot write to ' + p.y + ',' + p.x + ' in ' + map.length
        }
    }
    let well: point = { x: 500 - offset + 1, y: 0 }
    set(map, well, '+')

    function* rangeToArr(r: range) {
        var i = r.start;
        while (i <= r.end) {
            yield i++;
        }
    }

    clay.forEach(r => {
        if (typeof (r.x) === 'number') {
            let it = rangeToArr(<range>r.y)
            do {
                var nx = it.next()
                if (!nx.done) {
                    set(map, { x: r.x, y: nx.value }, '#')
                }
            } while (!nx.done)
        } else {
            let it = rangeToArr(<range>r.x)
            let nx = it.next()
            while (!nx.done) {
                set(map, { x: nx.value, y: <number>r.y }, '#')
                nx = it.next()
            }
        }
    })

    function show2(m: cell[][]): void {
        console.log(m.map(r => r.join('')).join('\n'))
        console.log()
    }
    function show(m: cell[][]): void {
        //console.log(m.map(r => r.join('')).join('\n'))
        //console.log()
    }

    show(map)

    type map = cell[][]

    type floodResult = 'blocking' | 'flowing'

    function floodtop(m: map, p: point): floodResult {
        if (p.y == maxy + 1) {
            return 'flowing'
        }

        var cell = m[p.y][p.x]
        switch (cell) {
            case '.':
            case '+':
                let downResult = floodtop(m, { x: p.x, y: p.y + 1 })
                if (downResult === 'flowing') {
                    set(m, p, '|')
                    show(m)
                    return 'flowing'
                }
                let left = floodDir(m, { x: p.x - 1, y: p.y }, -1)
                let right = floodDir(m, { x: p.x + 1, y: p.y }, +1)
                if (left == 'blocking' && right == 'blocking') {
                    set(m, p, '~')
                    show(m)
                    return 'blocking'
                } else {
                    set(m, p, '|')
                    if(left == 'blocking'){
                        blockToFlow(m,{x:p.x-1,y:p.y},-1)
                    }
                    if(right == 'blocking'){
                        blockToFlow(m,{x:p.x+1,y:p.y},1)
                    }
                    show(m)
                    return 'flowing'
                }
                break;
            case '#':
            case '~':
                return 'blocking';
            case '|':
                return 'flowing'
            default:
                throw 'd unexpected ' + cell + ' at ' + p.y + ',' + p.x
        }
    }

function blockToFlow(m:map,p:point,dir:-1|1):void{
            let cell = m[p.y][p.x]
        switch (cell) {
            case '#':
            case '|':
                return
                case '~':
                set(m,p,'|')
                blockToFlow(m,{x:p.x+dir,y:p.y},dir)
                return
            default:
                throw '' + dir + ' unexpected ' + cell + ' at ' + p.y + ',' + p.x

        }
}

    function floodDir(m: map, p: point, dir: -1 | 1): floodResult {
        let cell = m[p.y][p.x]
        switch (cell) {
            case '#':
                return 'blocking'
            case '|':
                return 'flowing'
            case '.':
                let down = floodtop(m, { x: p.x, y: p.y + 1 })
                if (down === 'flowing') {
                    set(m, p, '|')
                    return 'flowing'
                } else {
                    let onward = floodDir(m, { x: p.x + dir, y: p.y }, dir)
                    if (onward == 'flowing') {
                        set(m, p, '|')
                        return 'flowing'
                    } else {
                        set(m, p, '~')
                        return 'blocking'
                    }
                }
                break;
            default:
                throw '' + dir + ' unexpected ' + cell + ' at ' + p.y + ',' + p.x

        }
    }

    floodtop(map, { x: well.x, y: well.y + 1 })

    show2(map)

    //32643 too high
    return map.map((r, i) => i < miny ? 0 : i > maxy ? 0 : r.filter(c => c == '|' || c == '~').length).reduce((p, c) => p + c)
    //return { miny, maxy, minx, maxx }
});