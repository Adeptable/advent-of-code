using System;
using System.Linq;

namespace myApp
{
    class Program
    {
        static void Main(string[] args)
        {
            if(args.Length == 0){
                Run(System.IO.File.ReadAllLines(@"..\day-10.txt")[0]);
            }else{
                foreach(var arg in args){
                    Run(arg);
                }
            }
        // Console.WriteLine("Hello World! ");
        //#$n=5
        //#[int[]]$list = @(3, 4, 1, 5)
    }
        
    static void Run(string data){
            var n =256;

            var list = data.ToCharArray().Select(c=> (int)c).ToList();
            list.AddRange(new []{17, 31, 73, 47, 23});

            var elems = Enumerable.Range(0,n).ToArray();

            var skipSize=0;
            var pos=0;

            var rounds=Enumerable.Range(0,64);

            foreach (var round in rounds){
                //Console.WriteLine( $"round {round}");
                foreach(var len in list)
                {
                    //#write-host "$elems" 
                    //#write-host "$pos + $len"
                    if(len != 0)
                    {
                        var firstSection= elems.Skip(pos).Take(len).ToList();
                        var firstLen=firstSection.Count;
                        var remaining = len - firstLen;
                        var secondSection = elems.Take(remaining);
                        var toReverse = firstSection.Union(secondSection).ToList();

                        //#write-host "$firstsection + $secondsection = $toReverse (len $len)"
                        toReverse.Reverse();
                        //#Write-Host "$toreverse"
                        var rPos=pos;
                        foreach(var el in toReverse.Take( firstLen)) {
                            elems[rPos] = el;
                            rPos++;
                        }
                        rPos=0;
                        foreach(var el in toReverse.Skip(firstLen)){
                            elems[rPos] = el;
                            rPos++;
                        }
                    }
                    pos = (pos + len + skipSize) % n;
                    skipSize++;
                    //#Write-Host "$elems"
                    //#write-host "--"
                }
                //#Write-Host "$elems"
                //#write-host "--"   
            }

            var hash="";
            foreach(var part in Enumerable.Range( 0,16)){
                var dense=0;
                foreach (var x in elems.Skip(part*16).Take( 16)){
                    dense = dense ^ x; //binary xor?
                }

                //Console.WriteLine(dense);

                hash += dense.ToString("X").PadLeft(2,'0');
            }

            Console.WriteLine( hash);//.PadLeft(16,'0') );
        }
    }
}