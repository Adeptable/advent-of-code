var fs = require('fs');
fs.readFile('c:\\users\\david\\documents\\adventofcode\\2018\\03\\input.txt', 'ascii', (err, data: string) => {
    if (err) {
        console.error(err);
    } else {
        var claims = data.split('\n')
            .filter(a => a !== '')
            //            .filter((a, i) => i <= 1)
            // #1 @ 1,3: 4x4
            .map(a => /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/.exec(a))
            .map(a => { return { claim: a[1], x: parseInt(a[2], 10), y: parseInt(a[3], 10), w: parseInt(a[4], 10), h: parseInt(a[5], 10) } })

        var x = claims.map(a => {
            var pop: number[] = [];
            for (var i = a.x; i < a.x + a.w; i++) {
                for (var j = a.y; j < a.y + a.h; j++) {
                    pop.push(i * 1000 + j)
                }
            }
            return { claim: a, pop: pop, bad:false };
        })

        var found: {claim:{claim:string},bad:boolean}[] = [];
        x.forEach(c => {
            for (let index = 0; index < c.pop.length; index++) {
                var el = c.pop[index];
                if (found[el]) {
                    found[el].bad = true;
                    c.bad = true;
                } else {
                    found[el] = c;
                }
            }
        });

        console.log(x.filter(c=>!c.bad)[0].claim)
 /*           .reduce((p, v) => p.concat(v), [])
            .reduce<number[]>((p, v) => {
                p[v] = p[v] === undefined ? 1 : p[v] + 1;
                return p;
            }, [])
            .filter(x => x > 1)*/
        // .reduce((p,v)=> p.concat(v) ,[])
        //.filter((a, i) => i <= 10)
    //    console.log(x.length);
    }
});