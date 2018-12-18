(_ => {
    let recipies = [3, 7]
    let elves = [0, 1]

    let expect = [
        { after: 9, scores: 5158916779 },
        { after: 5, scores: 124515891 },
        { after: 18, scores: 9251071085 },
        { after: 2018, scores: 5941429882 },
        { after: 920831, scores: NaN },
    ]

    function work() {
        let sum = elves.map(v => recipies[v]).reduce((p, c) => c + p)
        let newRec = ('' + sum).split('').map(c => parseInt(c, 10))
        newRec.forEach(r => recipies.push(r))

        elves = elves.map(v => (v + 1 + recipies[v]) % recipies.length)
    }

    function logs() {
        console.log(recipies);
    }

    //logs()
    expect.forEach(e => {
        while (recipies.length < e.after + 10) {
            work()
            //logs()
        }
        console.log('after ' + e.after + ' expect ' + e.scores)
        console.log('after ' + e.after + ' got    ' + recipies.slice(e.after, e.after + 10).join(''))
    })

})(null)