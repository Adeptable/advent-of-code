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
        var x = data.split('\n')
            .filter(a => a !== '')
            //.filter((a, i) => i <= 10)
            .map(a =>
                a.split('')
                    //.sort()
                    .map(c => c.charCodeAt(0))
                    .reduce<number[]>((p, v) => {
                        p[v] = p[v] === undefined ? 1 : p[v] + 1;
                        return p;
                    }, [])
                    //.filter(x => x === 2 || x === 3)
                    .reduce/*<{two:Number, three:Number}>*/((p, v) => {
                        switch (v) {
                            case 2:
                                p.two = true;
                                break;
                            case 3:
                                p.three = true;
                                break;
                        };
                        return p
                    }, { two: false, three: false })
            )
            //.filter(x=> x.three === true)
            ;

        var two = x.filter(a => a.two).length;
        var three = x.filter(a => a.three).length;

        console.log(two * three);
    }
});