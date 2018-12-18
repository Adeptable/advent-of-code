using System;

namespace day_15
{
    class Program
    {
    static readonly UInt64 chopSize = (UInt64)System.Math.Pow(2,16);
static    UInt64 chop(UInt64 n){
        return  n % chopSize;
    }
    const int max = 2147483647;
    static UInt64 calc( UInt64 last, UInt64 factor){
        return (last*factor)% max;
    }
        static void Main(string[] args)
        {
            UInt64 a;
            UInt64 b;
            if(args.Length == 0){
                a = 65;
                b=8921;
            }
            else
            {
                a = UInt64.Parse(args[0]);
                b = UInt64.Parse(args[1]);
            }

            const int factors_a = 16807;
            const int factors_b = 48271;

            var count=0;

Console.WriteLine("".PadLeft(50,'-'));

            for(var j=0;j<50;j++){
            //for(var j=0;j<1;j++){
               Console.Write(".");
                for(var i=0;i<1_000_00;i++){
              //  for(var i=0;i<5;i++){
               
                    a = calc (a ,factors_a); 
               while (a%4!=0) {    a = calc (a ,factors_a); 
               }
                    b = calc (b ,factors_b); 
                while (b%8!=0){    b = calc (b ,factors_b); 
                }
var c_a=chop(a);
var c_b=chop(b);
//Console.WriteLine(a.ToString().PadLeft(16) +" "+ Convert.ToString((int)a,2).PadLeft(32,'0'));
//Console.WriteLine(b.ToString().PadLeft(16)+" "+Convert.ToString((int)b,2).PadLeft(32,'0'));
//Console.WriteLine();
                    if (c_a == c_b){
                        count++;
                    }
                }
            }
Console.WriteLine("");
            Console.WriteLine(count);
        }

                static void star1(string[] args)
        {
            UInt64 a;
            UInt64 b;
            if(args.Length == 0){
                a = 65;
                b=8921;
            }
            else
            {
                a = UInt64.Parse(args[0]);
                b = UInt64.Parse(args[1]);
            }

            const int factors_a = 16807;
            const int factors_b = 48271;

            var count=0;

Console.WriteLine("".PadLeft(40,'-'));

            for(var j=0;j<40;j++){
            //for(var j=0;j<1;j++){
               Console.Write(".");
                for(var i=0;i<1_000_000;i++){
              //  for(var i=0;i<5;i++){
                    a = calc (a ,factors_a); 
                    b = calc (b ,factors_b); 
var c_a=chop(a);
var c_b=chop(b);
//Console.WriteLine(a.ToString().PadLeft(16) +" "+ Convert.ToString((int)a,2).PadLeft(32,'0'));
//Console.WriteLine(b.ToString().PadLeft(16)+" "+Convert.ToString((int)b,2).PadLeft(32,'0'));
//Console.WriteLine();
                    if (c_a == c_b){
                        count++;
                    }
                }
            }
Console.WriteLine("");
            Console.WriteLine(count);
        }

    }
}
