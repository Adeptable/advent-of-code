var fs = require('fs');
var inputFile = process.mainModule.filename.match(/^(.*\\)[^\\]+\.[^\\]+$/)[1] + 'input.txt'
fs.readFile(inputFile, 'ascii', (err, data: string) => {
    if (err) {
        console.error(err);
    } else {
        var exdata = [`10 players; last marble is worth 1618 points: high score is 8317
`,
            `13 players; last marble is worth 7999 points: high score is 146373
`,
            `17 players; last marble is worth 1104 points: high score is 2764
`,
            `21 players; last marble is worth 6111 points: high score is 54718
`,
            `30 players; last marble is worth 5807 points: high score is 37305
`,
            `9 players; last marble is worth 25 points
`]

        //data = exdata[1]

        var extract = /^(\d+) .* (\d+) .*$/.exec(data.split('\n')[0])
        var playerCount = parseInt(extract[1], 10)
        var marbleCount = parseInt(extract[2], 10)

        var circle: number[] = [0]

        var marbleNum = 1

        function pos(n: number, circle: any[]) {
            return (n + circle.length) % circle.length
        }

        var players = [...Array(playerCount).keys()].map(x => 0)

        var playerIdx = 0;
        var marbIdx = 0;
        while (marbleNum <= marbleCount) {
            if (marbleNum % 23 == 0) {
                players[playerIdx] += marbleNum
                var remIdx = pos(marbIdx - 7, circle)
                players[playerIdx] += circle[remIdx]                
                if(Number.isNaN(players[playerIdx])){
                    console.log(circle)
                    console.log(playerIdx, players, marbIdx, remIdx)
                    throw 'failed at ' + marbleNum
                }
                circle.splice(remIdx, 1)
                marbIdx = pos(remIdx, circle)
            } else {
                var insIdx = pos(marbIdx + 1, circle) + 1
                if (insIdx == circle.length) {
                    circle.push(marbleNum)
                } else {
                    circle.splice(insIdx, 0, marbleNum)
                }
                marbIdx = pos(insIdx, circle)
            }

            //console.log(circle.map(n => (' ' + n).substr(-2, 2)).map((v, i) => v + (i == marbIdx ? '*' : ' ')).reduce((p, c) => p + ' ' + c, ''))

            marbleNum++
            playerIdx = (playerIdx + 1) % playerCount
        }

        console.log()
        var high = players.sort().reverse()[0]
        console.log(playerCount + ' players; last marble is worth ' + marbleCount + ' points; high score is ' + high)
        console.log(data)
        //too high: 413891
        //console.log(circle)
        //console.log(root.children[1])
        //console.log(playerCount, marbleCount)
    }
});