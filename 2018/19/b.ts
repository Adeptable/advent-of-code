import { unwatchFile } from "fs";
import { exec } from "child_process";

var utils = require('../00utils/utils')

utils.readLines((data: string[]) => {
    let exdata = `#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5`.split('\n')

    type reg = [number, number, number, number, number, number]
    type opFn = (r: reg) => reg
    type op = (a: number, b: number, c: number) => opFn

    function makeFn(fn: (r: reg) => void): opFn {
        return (r: reg) => {
            let x = r.map(i => i);
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

    //   data = exdata

    let ipn: number = parseInt(data[0].match(/^#ip (\d)$/)[1], 10)

    console.log(ipn)

    let prog = data.slice(1)
        .map(r => /^(.+) (\d+) (\d+) (\d+)$/.exec(r))
        .map(r => ({ op: r[1], a: parseInt(r[2], 10), b: parseInt(r[3], 10), c: parseInt(r[4], 10) }))
        .map(r => ops.get(r.op)(r.a, r.b, r.c))

    let regi: reg = [1, 0, 0, 0, 0, 0]
    regi = [0, 10551315, 3, 2, 0, 10551313]
    //regi=[ 0, 10551315, 3, 2, 0, 5275656 ] 
    regi=[ 0, 10551315, 3, 5, 0, 2110262 ] 
    let ip = regi[ipn]
    function exe() {
        regi = prog[ip](regi)
        ip = regi[ipn] + 1
        regi[ipn] = ip
    }

    function show() {
        return '' + ip + ': ' + regi.join()
    }
    let n = 0

    console.time()
    /*while ((ip < prog.length) && (n < 10 * 1000 * 1000)) {
        exe()
        n++
    }
            console.log( { n, regi })*/
    //    regi[1]=100
    //let maxn = 10*1000*1000*1000
    let maxn = 100
    while ((ip < prog.length) && (n < maxn)) {
        //        if (n % (10 * 1000 * 1000) === 0) {
        console.log({ n, regi })
        //      }
        exe()
        n++
    }
    console.timeEnd()

    //216 too low
    return { n, ip, l: prog.length, regi }
});