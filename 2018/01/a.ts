Object.defineProperty(Object.prototype, 'dump', {
    value: function <T>(this: T) {
        console.log(this);
        return this as T;
    }
});

interface Object {
    dump<T>(this: T): T;
};

/*Object.defineProperty(Object.prototype, 'dump', {
    value: function <T>(this: T, x:T) {
        //console.debug(typeof(args));
        console.log(this);
        return x;
    }
});

interface Object {
    dump<T>(this: T, x: T): T;
};*/

var fs = require('fs');
fs.readFile('c:\\users\\david\\documents\\adventofcode\\2018\\01\\input.txt', 'ascii', (err, data: string) => {
    if (err) {
        console.error(err);
    } else {
        var x = data.split('\n')
            .map(v => {
            var y =    parseInt(v, 10);
               // console.log('hi',v, y)
            return   y;
            
            })
            
            .filter(x=> !isNaN(x))
            .reduce((p, c, i, d) =>
             {
                 console.log(p,c)
                 return p + c}
             , 0);

        console.log(x);
    }
});