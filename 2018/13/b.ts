var utils = require('../00utils/utils')

utils.readLines((data: string[]) => {
    //return '\\';//.charAt(0)

    let exdata = [
    '/>-<\\  ',
    '|   |  ',
    '| /<+-\\',
    '| | | v',
    '\\>+</ |',
    '  |   ^',
    '  \\<->/']

    //var data = exdata

    type dir = '⮜' | '⮝' | '⮞' | '⮟'
    interface pos { x: number, y: number }
    interface cart { dir: dir, pos: pos, choice: 0 | 1 | 2, crashed: Boolean }



    type along = '┓' | '┗' | '┛' | '┏' | '┃' | '━'
    type track = along | '╋'
    type popcell = { track: track, cart?: cart }
    type cell = popcell | ' '


    function gridRow(s: string, i: number): cell[] {
        return s.replace(/-\\/g, '-┓')
            .replace(/\+\\/g, '+┓')
            .replace(/<\\/g, '<┓')
            .replace(/>\\/g, '>┓')
            .replace(/\\/g, '┗')
            .replace(/-\//g, '-┛')
            .replace(/\+\//g, '+┛')
            .replace(/<\//g, '<┛')
            .replace(/>\//g, '>┛')
            .replace(/\//g, '┏')
            .replace(/\|/g, '┃')
            .replace(/-/g, '━')
            .replace(/\+/g, '╋')
            .split('').map<cell>((c, at) => {
                var pos = { x: at, y: i }
                switch (c) {
                    case '^':
                        return { track: '┃', cart: { dir: '⮝', pos: pos, choice: 0, crashed: false } }
                    case 'v':
                        return { track: '┃', cart: { dir: '⮟', pos: pos, choice: 0, crashed: false } }
                    case '>':
                        return { track: '━', cart: { dir: '⮞', pos: pos, choice: 0, crashed: false } }
                    case '<':
                        return { track: '━', cart: { dir: '⮜', pos: pos, choice: 0, crashed: false } }
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

    function tick(g: grid) {
        carts.sort((a, b) => a.pos.y == b.pos.y ? a.pos.x - b.pos.x : a.pos.y - b.pos.y)
            .forEach(c => {
                if (c.crashed) {
                    return;
                }

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
                    c.crashed = true;
                    next.cart.crashed = true;
                    next.cart = null
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
    }

    var taken = 0
    while (carts.filter(x=>!x.crashed).length > 1) {
        //console.clear()
        //log(grid)
        tick(grid);
        taken++
    }

    //log(grid)
    return carts.filter(x=>!x.crashed)[0].pos
})
