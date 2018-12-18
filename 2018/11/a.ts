(_=>{
function pow(x: number, y: number, serial: number): number {
    //Find the fuel cell's rack ID, which is its X coordinate plus 10.
    let rackId = x + 10
    //Begin with a power level of the rack ID times the Y coordinate.
    let pow = rackId * y
    //Increase the power level by the value of the grid serial number (your puzzle input).
    pow += serial
    //Set the power level to itself multiplied by the rack ID.
    pow *= rackId
    //Keep only the hundreds digit of the power level (so 12345 becomes 3; numbers with no hundreds digit become 0).
    pow = ((pow - (pow % 100)) / 100) % 10
    //Subtract 5 from the power level.
    pow -= 5
    return pow
}


/*console.log('Fuel cell at  3,5, grid serial number 8: power level 4.')
inp = 8
console.log(pow(3,5))

console.log('Fuel cell at  122,79, grid serial number 57: power level -5.')
inp = 57
console.log(pow(122,79))

console.log('Fuel cell at 217,196, grid serial number 39: power level  0.')
inp = 39
console.log(pow(217,196))

console.log('Fuel cell at 101,153, grid serial number 71: power level  4.')
inp = 71
console.log(pow(101,153))*/

function findMax(ser: number) {
    var grid: number[][] = []
    for (var x = 1; x <= 300; x++) {
        var line = []//Array<number>(300);
        for (var y = 1; y <= 300; y++) {
            line.push(pow(x, y, ser))
        }
        grid.push(line)
    }

    //var tbt = { x: NaN, y: NaN, pow: Number.NEGATIVE_INFINITY }
    var tbt = { x: NaN, y: NaN, pow: -9999 }
    for (var x = 0; x < 300 - 2; x++) {
        for (var y = 0; y < 300 - 2; y++) {
            var curr = 0 + grid[x + 0][y + 0] + grid[x + 1][y + 0] + grid[x + 2][y + 0] + grid[x + 0][y + 1] + grid[x + 1][y + 1] + grid[x + 2][y + 1] + grid[x + 0][y + 2] + grid[x + 1][y + 2] + grid[x + 2][y + 2];

            //console.log(x, y, curr)
            //console.log(grid[x + 0][y + 0] ,grid[x + 1][y + 0] ,grid[x + 2][y + 0] ,grid[x + 0][y + 1] ,grid[x + 1][y + 1] ,grid[x + 2][y + 1] ,grid[x + 0][y + 2] ,grid[x + 1][y + 2] ,grid[x + 2][y + 2])

            if (curr > tbt.pow) {
                tbt = { x: x + 1, y: y + 1, pow: curr }
            }
        }
    }

    return tbt
}

console.log(18, { x: 33, y: 45 }, 29, findMax(18))
console.log(42, { x: 21, y: 61 }, 30, findMax(42))
console.log(2187, null, null, findMax(2187))
        //console.log(inp)
})(null)