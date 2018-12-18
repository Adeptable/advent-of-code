using System;
using System.Linq;

namespace myApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

 var data = System.IO.File.ReadAllContents("day-13.txt");
// #$data = gc .\day-13e.txt

var scanners = data.Select(d=> {
    var parts = d.split(':');
    return new{
         depth = int.Parse(parts[0]),
        cycle=(int.Parse(parts[1].SubString(1))-1)*2
     }
    }).ToList()

// Write-Host "unique cycles: $($scanners.cycle | sort -Unique)"

// $delay=0
// $success = $false

// $len = $scanners.length

// while(-not $success){
// #while($delay -eq 0){
//    if($delay % 10000 -eq 0) {Write-Host "trying with delay $($delay.tostring("n"))"}

//     $s=0
//     $hit=$false
//     while($s -lt $len -and -not $hit)
//     { 
//         $scan=$scanners[$s]
//         $time=$scan.depth + $delay
//         $pos = $time % $scan.cycle
//         $hit = $pos -eq 0
//         $s++
//     }

//     $success = -not $hit
//     $delay++
//     #write-host "$scannerpos"
// }

// #$success
// $delay-1

        }
    }
}
