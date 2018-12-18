interface point { x: number, y: number }

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

        //data = exdata

        var lines = data.split('\n')
            .filter(a => a !== '')
        //.filter((a, i) => i < 10)

        var links = lines.map(x => ({ l:x, r:/^Step (\S+) must be finished before step (\S+) can begin.$/.exec(x)}))
            .map(x => (x.r===null?((z=> {throw z} )(x.l)):( { before: x.r[1], after: x.r[2] })))

        var steps = links.reduce<string[]>((p, c) => p.concat(c.before, c.after), []).filter((v, i, a) => a.lastIndexOf(v) == i).sort()

        interface step { name: string, blocked: step[], blocking: step[] }

        var todo = steps.map<step>(s => ({ name: s, blocked: [], blocking: [] }))
        links.forEach(v => {
            var aft = todo.find(s => s.name == v.after)
            var bef = todo.find(s => s.name == v.before)
            aft.blocked.push(bef)
            bef.blocking.push(aft)
        });

        var done=''
        while (todo.length) {
            var next = todo.filter(x => x.blocked.length == 0)[0]
            console.log('found ', next.name, todo.length)
            next.blocking.forEach(element => {
                element.blocked.splice(element.blocked.indexOf(next), 1)
            });
            todo.splice(todo.indexOf(next),1)
            done+=next.name
        }

        console.log(done)
    }
});