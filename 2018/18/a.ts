import { unwatchFile } from "fs";

var utils = require('../00utils/utils')

utils.readLines((data: string[]) => {

    let exdata = `.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.`.split('\n')

    //data = exdata;

    type cell = '.' | '|' | '#'
    type map = cell[][]

    let m: map = data.map(r => <cell[]>r.split(''))

    function show(m: map) {
        return m.map(r => r.join('')).join('\n') + '\n'
    }
    function aCount(m: map, x: number, y: number, c: cell): number {
        return adjacent(m, x, y).filter(z => z == c).length
    }

    function adjacent(m: map, x: number, y: number): cell[] {
        return [
            m[y + 0][x + 1],
            m[y + 0][x - 1],
        ].concat(
            y == 0 ? [] : [
                m[y - 1][x + 1],
                m[y - 1][x + 0],
                m[y - 1][x - 1],]
        ).concat(
            y == m.length - 1 ? [] : [
                m[y + 1][x + 1],
                m[y + 1][x + 0],
                m[y + 1][x - 1],]
        ).filter(c => c != undefined)
    }

    function advance(m: map): map {
        return m.map((r, y) => r.map((c, x) => {
            switch (c) {
                case '.':
                    return aCount(m, x, y, '|') >= 3 ? '|' : '.'
                case '|':
                    return aCount(m, x, y, '#') >= 3 ? '#' : '|'
                case '#':
                    return aCount(m, x, y, '#') > 0 && aCount(m, x, y, '|') > 0 ? '#' : '.'
                default:
                    throw 'unrecognized cell ' + c
            }
        }))
    }
    //console.log(show(m))

 //   return 

    let tick = 0
    while (tick < 20000) {
        tick++

        m = advance(m)
        if (tick % 1000 === 0) {
            console.log(tick + ':\t' + score(m))
        }

        //console.log('tick ' + tick + '\n' + show(m))
    }

    function score(m: map): number {

        let trees = 0
        let lumb = 0
        m.reduce((p, c) => p.concat(c)).forEach(c => {
            switch (c) {
                case '|':
                    trees++
                    break
                case '#':
                    lumb++
                    break
            }
        })

        return trees * lumb
    }

    //199044 too high
    //194948 too low
    return score(m)
});