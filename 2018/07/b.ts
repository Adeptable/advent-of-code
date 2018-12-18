var fs = require('fs');
var inputFile = process.mainModule.filename.match(/^(.*\\)[^\\]+\.[^\\]+$/)[1] + 'input.txt'
fs.readFile(inputFile, 'ascii', (err, data: string) => {
    if (err) {
        console.error(err);
    } else {
        var exdata = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`

        var workforce = 5
        var minTime = 60
        //data = exdata; workforce = 2; minTime = 0

        var lines = data.split('\n')
            .filter(a => a !== '')
        //.filter((a, i) => i < 10)

        var links = lines.map(x => ({ l: x, r: /^Step (\S+) must be finished before step (\S+) can begin.$/.exec(x) }))
            .map(x => (x.r === null ? ((z => { throw z })(x.l)) : ({ before: x.r[1], after: x.r[2] })))

        var steps = links.reduce<string[]>((p, c) => p.concat(c.before, c.after), []).filter((v, i, a) => a.lastIndexOf(v) == i).sort()

        interface step { name: string, blockedBy: step[], blocking: step[], doneAt: number }

        function timeTaken(name: string) {
            const offset = 'A'.charCodeAt(0)
            return minTime + (name.charCodeAt(0) - offset) + 1
        }


        var todo = steps.map<step>(s => ({ name: s, blockedBy: [], blocking: [], doneAt: NaN }))
        links.forEach(v => {
            var aft = todo.find(s => s.name == v.after)
            var bef = todo.find(s => s.name == v.before)
            aft.blockedBy.push(bef)
            bef.blocking.push(aft)
        });

        var freeHelp = workforce
        var tick = 0
        while (todo.length) {
            todo.filter(x => x.doneAt == tick).forEach(x => {
                //console.log('done', x.name, 'at', tick)
                x.blocking.forEach(element => {
                    element.blockedBy.splice(element.blockedBy.indexOf(x), 1)
                });
                todo.splice(todo.indexOf(x), 1)
                freeHelp++
            })

            todo.filter(x => x.blockedBy.length == 0 && Number.isNaN(x.doneAt)).splice(0, freeHelp).forEach(x => {
                //console.log('starting', x.name, 'at', tick)
                freeHelp--
                x.doneAt = tick + timeTaken(x.name)
            })

            console.log('at', tick, 'running', todo.filter(x=>!Number.isNaN(x.doneAt)).map(x=>x.name).reduce((p,c)=>p+c,''))
            tick++
        }

        console.log(tick-1)
    }
});