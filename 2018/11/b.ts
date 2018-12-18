(_ => {
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

    function getGrid(ser: number) {
        var grid = []
        for (var x = 1; x <= 300; x++) {
            var line = []//Array<number>(300);
            for (var y = 1; y <= 300; y++) {
                line.push({ p: pow(x, y, ser), s: NaN })
            }
            grid.push(line)
        }
        return grid
    }

    interface p { p: number, s: number }

    function findMax(grid: p[][], siz: number) {
        //var tbt = { x: NaN, y: NaN, pow: Number.NEGATIVE_INFINITY }
        var tbt = { x: NaN, y: NaN, siz: siz, pow: -9999 }
        for (var x = 0; x < 300 - siz + 1; x++) {
            for (var y = 0; y < 300 - siz + 1; y++) {
                var curr: number;
                if (siz == 1) {
                    curr = 0;
                } else {
                    curr = grid[x][y].s;
                }
                for (var xx = 0; xx < siz - 1; xx++) {
                    curr += grid[x + xx][y + siz - 1].p
                }
                for (var yy = 0; yy < siz - 1; yy++) {
                    curr += grid[x + siz - 1][y + yy].p
                }
                curr += grid[x + siz - 1][y + siz - 1].p
                grid[x][y].s = curr

                if (curr > tbt.pow) {
                    tbt = { x: x + 1, y: y + 1, siz: siz, pow: curr }
                }
            }
        }

        return tbt
    }

    //console.log(18, { x: 33, y: 45 }, 29, findMax(18))
    //console.log(42, { x: 21, y: 61 }, 30, findMax(42))
    var best = { x: NaN, y: NaN, siz: NaN, pow: Number.NEGATIVE_INFINITY }
    var grid = getGrid(2187)
    for (var s = 1; s <= 300; s++) {
    //for (var s = 1; s <= 3; s++) {
        console.log('considering ' + s, best)
        //console.log(grid)
        var curr = findMax(grid, s)
        if (curr.pow > best.pow) {
            best = curr;
        }
    }
    console.log('' + best.x + ',' + best.y + ',' + best.siz)

})(null)