var utils = require('../00utils/utils')

utils.readLines((data: string[]) => {
    let exdata = `initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`

    //data = exdata.split('\n');

    var initialState = data[0].split(' ')[2].split('').map(c => c == '#' ? 1 : 0)
    var zer: (0 | 1) = initialState.splice(0, 1)[0]
    var negs: (0 | 1)[] = []

    function or(n) {
        return n === undefined ? 0 : n
    }

    function score(a: (0 | 1), b: (0 | 1), c: (0 | 1), d: (0 | 1), e: (0 | 1)) {
        return or(a) * 1 + or(b) * 2 + or(c) * 4 + or(d) * 8 + or(e) * 16
    }

    function score2(a) {
        return score(a[0], a[1], a[2], a[3], a[4])
    }

    var rules = data.splice(2)
        .map(x => /^(.{5}) => (.)$/.exec(x))
        .map(x => ({ pattern: x[1].split('').map(c => c == '#' ? 1 : 0), result: x[2] == '#' ? 1 : 0 }))



    //var m = new Map<number, (0 | 1)>();
    //rules.forEach(r => m.set(r.pattern, r.result))
    var mf: (0 | 1)[] = [...Array.from({ length: 32 }).keys()].map<(0 | 1)>(x => 0)
    var mb: (0 | 1)[] = [...Array.from({ length: 32 }).keys()].map<(0 | 1)>(x => 0)
    rules.forEach(r => mf[score2(r.pattern)] = r.result as (0 | 1))
    rules.forEach(r => mb[score2(r.pattern.reverse())] = r.result as (0 | 1))

    //console.log(m)

    function move(fwd: (0 | 1)[], bak: (0 | 1)[], m, lg) {
        var len = fwd.length;
        //fwd = '....' + fwd + '....';
        var newState = Array<(0 | 1)>(len + 2)

        var patt0 = score(bak[0], zer, fwd[0], fwd[1], fwd[2])
        newState[0] = m[patt0]
        //if(lg){console.log(patt0 ,bak[0], zer, fwd[0], fwd[1], fwd[2])}

        var patt1 = score(zer, fwd[0], fwd[1], fwd[2], fwd[3])
        newState[1] = m[patt1]

        for (let ii = 2; ii < len + 2; ii++) {
            var patt = score(fwd[ii - 2], fwd[ii - 1], fwd[ii], fwd[ii + 1], fwd[ii + 2])
            newState[ii] = m[patt]
        }
        var lastVal = newState.lastIndexOf(1);
        if (lastVal == -10) {
            return []
        }
        else if (lastVal != newState.length) {
            //return newState
            return newState.slice(0, lastVal + 1)
        } else {
            return newState
        }
    }

    //console.log(m)

    //var gen=50000000000
    var gen = 5000
    //var gen = 20
    console.time()
    //logs()
    var last = NaN
    for (let ii = 0; ii < gen; ii++) {
 var p = pot();
        console.log(ii,p, p-last, p- (358+(23*ii)))
        last=p;
        //console.log('  '.repeat(gen - ii) + initialState)
        var a = move(initialState, negs, mf, 0)
        var patt0 = score(negs[1], negs[0], zer, initialState[0], initialState[1])
        var c = mf[patt0]
        var b = move(negs, initialState, mb, 0)

        initialState = a
        zer = c
        negs = b

        //logs()
    }
        console.log(gen, pot())//- (-626+(20*ii)))
    function logs() {
        //console.log(negs)
        //console.log(' '.repeat(gen * 2 - negs.length + 5) + negs.map(x => x ? '#' : '.').reverse().join('') + '|' + (zer[0] ? '#' : '.') + '|' + initialState.map(x => x ? '#' : '.').join(''))
    }

    //console.log(initialState)
    console.timeEnd()

    function pot() {
        var pots = initialState.map((v, i) => v === 1 ? i + 1 : 0).reduce((p, c) => p + c, 0)
            + negs.map((v, i) => v === 1 ? -1 - i : 0).reduce((p, c) => p + c, 0)
        return pots
    }

    //999999999374 too low
    //888499999999374
    //9999999999374 too high
})