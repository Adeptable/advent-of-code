var utils = require('../00utils/utils')

utils.readLines((data: string[]) => {
    let exdata = ['#######',
        '#.G...#',
        '#...EG#',
        '#.#.#G#',
        '#..G#E#',
        '#.....#',
        '#######',
    ]

//    data = exdata;

    class pos {
        constructor(xx, yy) {
            this.x = xx;
            this.y = yy
        }
        x: number
        y: number

        compareTo(other: pos): number {
            return this.y == other.y ? this.x - other.x : this.y - other.y
        }

        isNextTo(other: pos): boolean {
            return Math.abs(this.y - other.y) + Math.abs(this.x - other.x) === 1
        }

        getAdjacent(): pos[] {
            return [
                new pos(this.x + 1, this.y + 0),
                new pos(this.x - 1, this.y + 0),
                new pos(this.x + 0, this.y + 1),
                new pos(this.x + 0, this.y - 1),
            ]
        }
    }

    class unit {
        pos: pos
        health: number = 200

        constructor(p: pos) {
            this.pos = p;
        }

        getInAttackRangeOf(targets: unit[]): unit[] {
            var myPos = this.pos;
            return targets.filter(t => t.pos.isNextTo(myPos))
        }

        /*        private unique<T>(items: T[], comparator: (x: T, y: T) => number, none: T): T[] {
                    var curr = none;
                    var result = []
                    items.sort(comparator).forEach(a => {
                        if (!comparator(a, curr)) {
                            curr = a
                            result.push(a)
                        }
                    })
                    return result;
                }
        
                private getAdjacentWalkableUnique(start: pos[], m: map): pos[] {
                    var desired = start.map(m => m.getAdjacent()).reduce((p, c) => p.concat(c))
                    var d2 = this.unique(desired, (x, y) => x.compareTo(y), new pos(NaN, NaN))
                    return d2.filter(p => {
                        var tile = m.getAt(p);
                        return tile instanceof floor && !tile.unit
                    })
                }*/

        get symbol(): string {
            return '?'
        }

        private getAdjacentWalkable(start: pos, m: map, walkable: (p: pos) => boolean): pos[] {
            var desired = start.getAdjacent()
            return desired.filter(p => walkable(p))
        }

        private findClosestStepsTo(start: pos, m: map, match: (u: unit) => boolean): pos[] {

            var size = m.size;
            var scores: number[][] = [...Array.from({ length: size.y })].map(y => [...Array.from({ length: size.x })].map(v => Number.POSITIVE_INFINITY))
            function getScore(pos: pos) { return scores[pos.y][pos.x] }
            function setScore(pos: pos, val: number) { scores[pos.y][pos.x] = val }

            let found = false
            let edges: pos[] = [start]
            var currScore = 0
            let prevEdges: pos[] = []
            setScore(start, currScore)

            let walkable = function (p: pos) {
                let tile = m.getAt(p)
                return tile instanceof floor && (!tile.unit || match(tile.unit))
            }

            while (edges.length > 0 && !found) {
                currScore++;
                let nextEdges: pos[] = []
                edges.forEach(e => {
                    this.getAdjacentWalkable(e, m, walkable).forEach(n => {
                        if (getScore(n) <= currScore) {
                            //ignore, there is a faster or equivalent route
                        } else {
                            setScore(n, currScore)
                            nextEdges.push(n)
                            let tile = m.getAt(n)
                            if (tile instanceof floor && tile.unit && match(tile.unit)) {
                                found = true
                            }
                        }
                    })
                })
                prevEdges = edges;
                edges = nextEdges

            }

            return prevEdges.filter(e => e.getAdjacent().some(a => {
                let tile = m.getAt(a)
                return tile instanceof floor && tile.unit && match(tile.unit)
            }))
        }

        move(m: map): pos | null {

            let reachable = this.findClosestStepsTo(this.pos, m, u => u.symbol != this.symbol)

            if (reachable.length == 0) {
                return null
            }

            let prefered = reachable.sort((x, y) => x.compareTo(y))[0]

            var backfill = this.findClosestStepsTo(prefered, m, u => u.pos.compareTo(this.pos) === 0)

            return backfill.sort((x, y) => x.compareTo(y))[0]
        }

        attack(targets: unit[]): unit | null {
            if (targets.length > 0) {
                var minHealth = targets.map(m => m.health).reduce((p, c) => Math.min(p, c), Number.POSITIVE_INFINITY)
                var primary = targets.filter(t => t.health == minHealth).sort((x, y) => x.pos.compareTo(y.pos))[0]
                primary.health -= 3
                if (primary.health < 0) {
                    return primary
                } else {
                    return null
                }
            } else {
                return null;
            }

        }
    }

    class elf extends unit {
        get symbol() { return 'E' }
    }
    class goblin extends unit {
        get symbol() { return 'G' }
    }
    class wall {
        pos: pos
        unit: null = null
        constructor(p: pos) {
            this.pos = p;
        }
        get symbol() { return '#' }
    }
    class floor {
        pos: pos
        unit?: elf | goblin

        get symbol() {
            return this.unit ? this.unit.symbol : '.'
        }

        constructor(p: pos, u?: elf | goblin) {
            this.pos = p
            this.unit = u
        }
    }
    type tile = wall | floor
    class map {
        private data: tile[][]

        get size() { return { y: data.length, x: data[0].length } }

        show = function () {
            return this.data.map(r => {
                let units = []
                return r.map(c => {
                    if (c.unit) {
                        units.push(c.unit)
                    }
                    return c.symbol
                }).join('') + '    ' + units.map(u => u.symbol + '(' + u.health + ')').join(', ')
            }).join('\n')
        }

        private elves: elf[] = []
        private goblins: goblin[] = []

        private get units() { return this.elves.map(e => <unit>e).concat(this.goblins.map(g => <unit>g)) }

        constructor(data: string[]) {
            this.data = data.map((m, y) => m.split('').map((c, x) => {
                var p = new pos(x, y)
                switch (c) {
                    case '.':
                        return new floor(p)
                    case '#':
                        return new wall(p)
                    case 'E':
                        let e = new elf(p)
                        this.elves.push(e)
                        return new floor(p, e)
                    case 'G':
                        var g = new goblin(p)
                        this.goblins.push(g)
                        return new floor(p, g)
                    default:
                        throw 'unrecognized input character ' + c
                }
            }))
        }

        getAt = function (pos: pos): tile {
            return this.data[pos.y][pos.x]
        }

        unitTurn = function (unit: unit, targets: unit[]): boolean {
            targets = targets.filter(x => x.health > 0)
            if (targets.length == 0) {
                //console.log('no more targets')
                return true
            }

            let isInRange = unit.getInAttackRangeOf(targets);
            if (isInRange.length == 0) {
                //console.log('not in range, move?')
                var dest = unit.move(m)
                if (dest != null) {
                    console.group()
                    //console.log('moving from', unit.pos, 'to', dest)
                    let from = unit.pos
                    //console.log('clearing', from)
                    this.floorAt(from).unit = null;
                    //console.log('updating my position', from)
                    unit.pos = dest
                    this.floorAt(unit.pos).unit = unit;

                    //console.log('moved, checking for targets I can reach')
                    isInRange = unit.getInAttackRangeOf(targets)
                    console.groupEnd()
                }
            }

            if (isInRange.length != 0) {
                //console.log('attack from', unit)
                let killed = unit.attack(isInRange)
                if (killed) {
                    this.floorAt(killed.pos).unit = null;
                }
            }

            return false
        }

        private floorAt(p: pos): floor {
            let at = this.getAt(p)
            if (at instanceof floor) {
                return at
            } else {
                throw 'in a wall? ' + pos + ' was ' + at.symbol
            }
        }

        round: number = 0
        doRound = function (): boolean {

            let inOrder = this.units.sort((x, y) => x.pos.compareTo(y.pos))
            for (var ii = 0; ii < inOrder.length; ii++) {
                var u = inOrder[ii]
                if (u.health > 0) {
                    let endRound
                    //console.log('running unitTurn for', u)
                    console.group()
                    if (u instanceof elf) {
                        endRound = this.unitTurn(u, this.goblins)
                    } else if (u instanceof goblin) {
                        endRound = this.unitTurn(u, this.elves)
                    } else {
                        throw 'unrecognized unit ' + typeof (u)
                    }
                    console.groupEnd()
                    if (endRound) {
                        return false;
                    }
                }
            }
            this.goblins = this.goblins.filter(g => g.health > 0)
            this.elves = this.elves.filter(g => g.health > 0)
            this.round++
            return true
        }

        run(): void {
            let running = true
            while (running) {
                //console.log('attempting round ' + this.round)
                running = this.doRound()
                //console.log(this.show())
                //console.log()
            }
        }

        outcome():number {
            return this.round * this.units.filter(x=>x.health > 0).reduce((p,c)=>p+c.health,0)
        }
    }

    let m = new map(data)
    console.log(m.show() + '\n')
    m.run()
    console.log(m.show() + '\n')

    return m.outcome()
})