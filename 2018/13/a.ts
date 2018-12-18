var utils = require('../00utils/utils')

utils.readLines((data: string[]) => {
    //return '\\';//.charAt(0)

    let exdata = ['/->-\\        ',
        '|   |  /----\\',
        '| /-+--+-\\  |',
        '| | |  | v  |',
        '\\-+-/  \\-+--/',
        '  \\------/   ']

    //var data = exdata

    type dir = '⮜' | '⮝' | '⮞' | '⮟'
    interface pos { x: number, y: number }
    interface cart { dir: dir, pos: pos, choice: 0 | 1 | 2 }



    type along = '┓' | '┗' | '┛' | '┏' | '┃' | '━'
    type track = along | '╋'
    type popcell = { track: track, cart?: cart }
    type cell = popcell | ' '


    function gridRow(s: string, i: number): cell[] {
        return s.replace(/-\\/g, '-┓')
            .replace(/\+\\/g, '+┓')
            .replace(/\\/g, '┗')
            .replace(/-\//g, '-┛')
            .replace(/\+\//g, '+┛')
            .replace(/\//g, '┏')
            .replace(/\|/g, '┃')
            .replace(/-/g, '━')
            .replace(/\+/g, '╋')
            .split('').map<cell>((c, at) => {
                var pos = { x: at, y: i }
                switch (c) {
                    case '^':
                        return { track: '┃', cart: { dir: '⮝', pos: pos, choice: 0 } }
                    case 'v':
                        return { track: '┃', cart: { dir: '⮟', pos: pos, choice: 0 } }
                    case '>':
                        return { track: '━', cart: { dir: '⮞', pos: pos, choice: 0 } }
                    case '<':
                        return { track: '━', cart: { dir: '⮜', pos: pos, choice: 0 } }
                    case ' ':
                        return ' '
                    default:
                        return { track: <track>c }
                }
            })
    }

    var grid: cell[][] = data.map((x, i) => gridRow(x, i))

    var carts = grid.reduce((p, c) => c.concat(p)).filter(c => c != ' ' && c.cart).map(c => (<popcell>c).cart);
    var popcells = grid.reduce((p, c) => c.concat(p)).filter(c => c != ' ').map(c => <popcell>c)



    function log(d: cell[][]) {
        //console.clear()
        console.log(d.map(x => x.map(c =>
            c == ' '
                ? ' '
                : c.cart != null
                    ? c.cart.dir
                    : c.track
        ).join('')).join('\n'))
    }

    type grid = cell[][]

    function tick(g: grid):  pos{
        
        var crash = null;
        carts.sort((a, b) => a.pos.y == b.pos.y ? a.pos.x - b.pos.x : a.pos.y - b.pos.y)
            .forEach(c => {
                (<popcell>g[c.pos.y][c.pos.x]).cart = null;
                switch (c.dir) {
                    case '⮝':
                        c.pos.y--
                        break
                    case '⮟':
                        c.pos.y++
                        break
                    case '⮞':
                        c.pos.x++
                        break
                    case '⮜':
                        c.pos.x--
                        break
                    default:
                        throw c.dir
                }

                var next = <popcell>g[c.pos.y][c.pos.x]
                if (next.cart) {
                    crash = c.pos
                } else {
                    next.cart = c
                    switch (next.track) {
                        case '━':
                        case '┃':
                            //continue
                            break;
                        case '┏':
                            switch (c.dir) {
                                case '⮝':
                                    c.dir = '⮞'
                                    break;
                                case '⮜':
                                    c.dir = '⮟'
                                    break;
                                default:
                                    throw c.dir + ' on ' + next.track;
                            }
                            break;
                        case '┓':
                            switch (c.dir) {
                                case '⮝':
                                    c.dir = '⮜'
                                    break;
                                case '⮞':
                                    c.dir = '⮟'
                                    break;
                                default:
                                    throw c.dir + ' on ' + next.track;
                            }
                            break;
                        case '┗':
                            switch (c.dir) {
                                case '⮟':
                                    c.dir = '⮞'
                                    break;
                                case '⮜':
                                    c.dir = '⮝'
                                    break;
                                default:
                                    throw c.dir + ' on ' + next.track;
                            }
                            break;
                        case '┛':
                            switch (c.dir) {
                                case '⮞':
                                    c.dir = '⮝'
                                    break;
                                case '⮟':
                                    c.dir = '⮜'
                                    break;
                                default:
                                    throw c.dir + ' on ' + next.track;
                            }
                            break;
                        case '╋':
                            switch (c.choice) {
                                case 0:
                                    switch (c.dir) {
                                        case '⮜':
                                            c.dir = '⮟'
                                            break;
                                        case '⮝':
                                            c.dir = '⮜'
                                            break;
                                        case '⮞':
                                            c.dir = '⮝'
                                            break;
                                        case '⮟':
                                            c.dir = '⮞'
                                            break;
                                    }
                                    c.choice = 1;
                                    break;
                                case 1:
                                    c.choice = 2
                                    break;
                                case 2: 
                                     switch (c.dir) {
                                        case '⮜':
                                            c.dir = '⮝'
                                            break;
                                        case '⮝':
                                            c.dir = '⮞'
                                            break;
                                        case '⮞':
                                            c.dir = '⮟'
                                            break;
                                        case '⮟':
                                            c.dir = '⮜'
                                            break;
                                    }
                                    c.choice = 0
                                    break;
                            }
                            break;
                        default:
                            throw 'unknown ' + next.track
                    }
                }
            })

        return crash
    }

    let crash = null;
    var taken = 0
    while (!crash) {
        log(grid)
        crash = tick(grid);
        taken++
    }
    return crash
})