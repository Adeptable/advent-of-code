Object.defineProperty(Object.prototype, 'dump', {
    value: function <T>(this: T) {
        console.log(this);
        return this as T;
    }
});
interface Object {
    dump<T>(this: T): T;
};

var fs = require('fs');
fs.readFile('c:\\users\\david\\documents\\adventofcode\\2018\\02\\input.txt', 'ascii', (err, data: string) => {
    if (err) {
        console.error(err);
    } else {
        var lines =
            data.split('\n')
                .filter(a => a !== '')
        //.filter((a, i) => i <= 10)
        var found: string;
        for (var i = 0; i < lines.length && !found; i++) {
            var foundA = lines[i];
            for (var j = i + 1; j < lines.length && !found; j++) {
                var foundB = lines[j];

                var diff = 0;
                var diffIdx: number;
                for (var idx = 0; idx < foundA.length; idx++) {
                    if (foundA.charAt(idx) != foundB.charAt(idx)) {
                        diff++;
                        diffIdx = idx;
                        if (diff > 1) {
                            break;
                        }
                    }
                }
                if (diff == 1) {
                    console.log(foundA)
                    console.log(foundB)
                    found = foundB.substring(0,diffIdx) + foundB.substring(diffIdx+1);

                }
            }
        }
        console.log(found)
    }
});