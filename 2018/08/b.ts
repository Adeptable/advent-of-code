var fs = require('fs');
var inputFile = process.mainModule.filename.match(/^(.*\\)[^\\]+\.[^\\]+$/)[1] + 'input.txt'
fs.readFile(inputFile, 'ascii', (err, data: string) => {
    if (err) {
        console.error(err);
    } else {
        var exdata = `2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2
      `

        //data = exdata

        var lines = data.split('\n')
            .filter(a => a !== '')
        //.filter((a, i) => i < 10)

        var entries = lines[0].split(' ').map(x => parseInt(x, 10))

        function* infiniteSequence() {
            var i = 'A'.charCodeAt(0);
            while (true) {
                yield String.fromCharCode(i++);
            }
        }
        var chars = infiniteSequence();

        interface node { name: string, children: node[], metadata: number[], parent: node | null }
        var entriesIt = entries.values()

        function readNode(itter: IterableIterator<number>, parent: node | null): node {
            var childCount = itter.next().value;
            var metaCount = itter.next().value;
            var node = { name: chars.next().value, children: [], metadata: [], parent: parent }
            for (var i = 0; i < childCount; i++) {
                node.children.push(readNode(itter, node))
            }
            for (var i = 0; i < metaCount; i++) {
                node.metadata.push(itter.next().value)
            }
            return node
        }

        var root = readNode(entriesIt, null)


        function sum(ns: number[]): number {
            return  ns.reduce((p, c) => p + c, 0)
        }


        function val(n: node):number {
            return n.children.length == 0 
            ? sum( n.metadata) 
            : sum(n.metadata.filter(m=> m>0 && m<= n.children.length)
                            .map(m=> val(n.children[m-1])))
        }

        //console.log(root.children[1])
        console.log(val(root))
    }
});