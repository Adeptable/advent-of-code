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

var mypairs = pairs
.map(p => {
    var re:{g:number, min:number}[] = [];
    for (let index = p.start; index < p.end; index++) {
        re.push({g:p.guard, min:index});
    }
    return re;
})
.reduce((p,v)=> v.concat(p))
.map(v=> ({key:v.g * 100 + v.min, val:v.g*v.min}))
.reduce<{val:number,count:number}[]>((p,v)=>{
    
    p[v.key] = (p[v.key] === undefined ? { val: v.val, count:0 } : p[v.key]);
    p[v.key].count++
    return p;
},[])
.sort((x,y)=>y.count-x.count)[0].val;


        //            console.log(lines)
        //            console.log(records)
        //            console.log(events)
        console.log( mypairs)
    }
});