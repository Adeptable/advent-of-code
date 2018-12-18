using System;

namespace day_17
{
    class Program
    {
        static void Main(string[] args)
        {
var data = 301;
//$data = 3
var limit = 50000001;
//$limit = 8

var idx = 0;
var val=1;
var sofar = -1;
var len = 1;

while (val < limit){
    for (var i = 0; i < 50000; i++) {    
        idx = ((idx+data) % len) + 1;
    
        len++;
        if (idx == 1)
        {
            sofar = val;
        }
        //#Write-Host "after $insertions insertions, idx is $idx / $len, zero index is $zeroIdx and the next number is $sofar"
        val++;
    }
    Console.WriteLine($"done ~{((val-1)/1000)}k");
}
Console.WriteLine($"after {(val-1)} insertions, idx is {idx} / {len}, the next number is {sofar}");
        }
    }
}
