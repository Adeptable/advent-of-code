var utils = require('../00utils/utils')

utils.read((data: string) => {

    function parseArr(s: string, sep: string): number[] {
        return s.split(sep).map(i => parseInt(i, 10))
    }

    var split = data.split('\n\n\n\n')
    var examples = split[0].split('\n\n')
//        .slice(2, 3)
        .map(m => /^Before: \[(.*)\]\n(.*)\nAfter:  \[(.*)\]$/m.exec(m))
        .map(r => ({ before: r[1], instr: r[2], after: r[3] }))
        .map(r => ({
            before: <reg>parseArr(r.before, ', '),
            instr: parseArr(r.instr, ' '),
            after: <reg>parseArr(r.after, ', ')
        }));

    var prog = split[1]

    type reg = [number, number, number, number]
    type opFn = (r: reg) => reg
    type op = (a: number, b: number, c: number) => opFn

    function makeFn(fn: (r: reg) => void): opFn {
        return (r: reg) => {
            let x = r.map(i=>i);
            fn(<reg>x)
            return <reg>x
        }
    }

    let ops: Map<string, op> = new Map([
        //    addr (add register) stores into register C the result of adding register A and register B.
        ['addr', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] + r[b] })],
        //    addi (add immediate) stores into register C the result of adding register A and value B.
        ['addi', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] + b })],
        //    mulr (multiply register) stores into register C the result of multiplying register A and register B.
        ['mulr', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] * r[b] })],
        //    muli (multiply immediate) stores into register C the result of multiplying register A and value B.
        ['muli', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] * b })],
        //    banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
        ['banr', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] & r[b] })],
        //    bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
        ['bani', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] & b })],
        //    borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
        ['borr', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] | r[b] })],
        //    bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
        ['bori', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] | b })],
        //    setr (set register) copies the contents of register A into register C. (Input B is ignored.)
        ['setr', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] })],
        //    seti (set immediate) stores value A into register C. (Input B is ignored.)
        ['seti', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = a })],
        //    gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
        ['gtir', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = a > r[b] ? 1 : 0 })],
        //    gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
        ['gtri', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] > b ? 1 : 0 })],
        //    gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
        ['gtrr', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] > r[b] ? 1 : 0 })],
        //    eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
        ['eqir', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = a === r[b] ? 1 : 0 })],
        //    eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
        ['eqri', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] === b ? 1 : 0 })],
        //    eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
        ['eqrr', (a: number, b: number, c: number) => makeFn((r: reg) => { r[c] = r[a] === r[b] ? 1 : 0 })],
    ])

//return ops.get('addr')(2,1,3)([1,1,1,1])

//console.log( examples)
    return examples.map(e => [...ops.keys()]
    .map(k=>({key:k, got: ops.get(k)(e.instr[1], e.instr[2], e.instr[3])(e.before), ex:e}))
    //.map(x=> x.key + ' ' + x.ex.before.join() + ' => ' + x.got.join() +' =? ' + x.ex.after.join())
    .filter(x =>x.got.every((v, i) => v === x.ex.after[i]))
        //.map(op => op.keys)
    )
        .map(ops => ops.length)
        .filter(n => n > 3).length

    //let rawProg:string[]=[]

    //for (var ii = 0; ii < data.length; ii++) {
    //}

    let registers = [0, 0, 0, 0]


});