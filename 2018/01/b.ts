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
fs.readFile('c:\\users\\david\\documents\\adventofcode\\2018\\01\\input.txt', 'ascii', (err, data: string) => {
    if (err) {
        console.error(err);
    } else {
        var changes = data.split('\n')
            .map(v => parseInt(v, 10))
            .filter(x => !isNaN(x));

        var curr = 0;
        var seen: number[] = [curr];
        var i = 0;
        var found = false;
        while (!found) {
            if (i == changes.length) {
                i = 0;
            }

//            console.log(curr);

            curr += changes[i];
            if (seen.indexOf(curr) !== -1) {
                found = true;
                console.log(curr);
            } else {
                seen.push(curr);
            }

            i++;
        }
    }
});