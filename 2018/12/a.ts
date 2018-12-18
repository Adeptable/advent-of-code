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

    var initialState = data[0].split(' ')[2] //.split('').map(c=>c=='#')

    var rules = data.splice(2)
        .map(x => /^(.{5}) => (.)$/.exec(x))
        .map(x => ({ pattern: x[1], result: x[2] }))

    var m = new Map<string, string>();
    rules.forEach(r => m.set(r.pattern, r.result))

    function move() {
        var len = initialState.length;
        initialState = '....' + initialState + '....';
        var newState = ''
        for (let ii = 0; ii < len + 4; ii++) {
            newState += (m.get(initialState.substr(ii, 5)) || '.')
        }
        initialState = newState;
    }

    var gen = 20
    for (let ii = 0; ii < gen; ii++) {
        //console.log('  '.repeat(gen - ii) + initialState)
        move()
    }
        //console.log(initialState)

    var pots = initialState.split('').map((v,i)=> v=='#'?i-(gen*2):0).reduce((p,c)=>p+c,0)

    return pots
})