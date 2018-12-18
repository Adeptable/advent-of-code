var fs = require('fs');
var inputFile = process.mainModule.filename.match(/^(.*\\)[^\\]+\.[^\\]+$/)[1] + 'input.txt'
fs.readFile(inputFile, 'ascii', (err, data: string) => {
    if (err) {
        console.error(err);
    } else {

        var lines = data.split('\n')
            .filter(a => a !== '')
        //.filter((a, i) => i <= 6)
        var records = lines
            //[1518-11-05 00:03] Guard #99 begins shift
            //[1518-11-05 00:45] falls asleep
            //[1518-11-05 00:55] wakes up
            .sort()
           // .filter((a, i) => i <= 60)
            .map(a => ({ t: a, a: /^\[(.*) \d+:(\d+)\] (\S+) (\S+)(\s.*)?$/.exec(a) }))
            .map(b => {
                if (b.a === null) { throw b.t } else {
                    return { day: b.a[1], minute: parseInt(b.a[2], 10), action: b.a[3], guard: b.a[4] }
                }
            })

        var events = [];
        var currGuard;
        records.forEach(v => {
            switch (v.action) {
                case 'Guard':
                    currGuard = parseInt(v.guard.substring(1), 10)
                    break;
                case 'wakes':
                case 'falls':
                    events.push({ day: v.day, minute: v.minute, action: v.action, guard: currGuard })
                    break
                default:
                    throw 'oops: ' + v.action;
            }
        })

        var pairs = [];
        var curr;
        events.forEach(v => {
            switch (v.action) {
                case 'falls':
                    curr = { day: v.day, guard: v.guard, start: v.minute, end: 0 }
                    break;
                case 'wakes':
                    curr.end = v.minute;
                    pairs.push(curr);
                    break;
                default:
                    throw 'oops2: ' + v.action;
            }
        })

        var dur = pairs.reduce<number[]>((p, v) => {
            p[v.guard] = (p[v.guard] === undefined ? 0 : p[v.guard]) + v.end - v.start
            return p;
        }, [])

        var myguard = dur.map((v,i)=>({v:v,i:i})).sort((x,y)=>y.v-x.v)[0].i

var mypairs = pairs.filter(x=>x.guard === myguard)
.map<number[]>(p=> {
    var re:number[] = [];
    for (let index = p.start; index < p.end; index++) {
        re.push(index);
    }
    return re;
})
.reduce((p,v)=> v.concat(p))
.reduce<number[]>((p,v)=>{
    p[v] = (p[v] || 0) + 1;
    return p;
},[])
.map((v,i)=>({v,i})).sort((x,y)=>y.v-x.v)[0].i;


        //            console.log(lines)
        //            console.log(records)
        //            console.log(events)
        console.log(myguard * mypairs, mypairs)
    }
});