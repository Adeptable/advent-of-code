(_ => {
    let recipies = [3, 7]
    let elves = [0, 1]

    let expect = [
        { score: '01245', after: 5 },
        { score: '51589', after: 9 },
        { score: '92510', after: 18 },
        { score: '59414', after: 2018 },
        { score: '920831', after: NaN },
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

    function check(index, lookFor) {
        return recipies.slice(index, index + lookFor.length).join('') === lookFor
    }

    //logs()
    expect.forEach(e => {
        let found = false
        let foundAt = NaN
        while (!found) {
            foundAt = recipies.length - 1 - e.score.length
            if (check(foundAt, e.score)) {
                found = true
            } else {
                foundAt--
                if (check(foundAt, e.score)) {
                    found = true
                } else {
                    work()
                }
            }
            //logs()
        }
        console.log('expect to find ' + e.score + ' after ' + e.after)
        console.log('found it after ' + foundAt)
    })

})(null)