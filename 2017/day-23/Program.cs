using System;
using System.Linq;
using System.Collections.Generic;

namespace day_23
{
    class Program
    {
        static long getval(Dictionary<string, long> reg, string arg){
            var val = -1;
            if (int.TryParse(arg, out val)){
                return val;
            } else{
                return reg[arg];
            }
        }

        static Func<long> getFn(Dictionary<string, long> reg, string arg){
            var val = -1;
            if (int.TryParse(arg, out val)){
                return ()=>val;
            } else{
                return ()=>reg[arg];
            }
        }
   static void Main(string[] args)
        {
            MM();
        }
        static void M1()
        {
            var data = System.IO.File.ReadAllLines("../day-23.txt");

            var reg = new System.Collections.Generic.Dictionary<string, long>();

            var instr = data.Select(
                row=>{
                var arg = row.Split(' ');

                return new {
                    act = arg[0],
                    aa=arg[1],
                    a = getFn(reg, arg[1]),
                    b = getFn(reg, arg[2]),
                    def = row.PadRight(8)
                };
            }).ToArray();

            var i = 1;
            var keys = new[]{"a","b","c","d","e","f","g","h"}; // instr.SelectMany(x=> new[]{ x.a,x.b}).Where(x => !int.TryParse(x, out i)).Distinct();
            foreach (var key in keys)
            {
                reg.Add(key, 0);                 
            }

            reg["a"]=1;

            var idx=0;


            Console.WriteLine($"{instr.Length} instructions parsed");
            long op=0;

            while( idx >= 0 && idx < instr.Length){
                var ins= instr[idx];

                switch(ins.act){
                    case "set":{
                        reg[ins.aa] =  ins.b();
                        idx++;
                        break;
                    }
                    case "sub":{
                        reg[ins.aa] -=  ins.b();
                        idx++;
                        break;
                    }
                    case "mul":{
                        reg[ins.aa] *=  ins.b();
                        idx++;
                        break;
                    }
                    case "jnz":
                    {
                        if (ins.a() != 0) 
                        {
                            idx += (int)ins.b();
                        } else{
                            idx++;
                        }
                        break;
                    }
                    default :{
                        throw new Exception($"did not understand instruction action {ins.act} at {idx}");
                    }
                }
                op++;
                if(op % 1_000_000 == 0)
                {    
                    Console.WriteLine($"{op} {idx}; {ins.def} > {String.Join("\t", reg.Select(x=>$"{x.Key}:{x.Value}"))}");
                }
            }

            Console.WriteLine(reg["h"]);
        }

        static void MM(){
            long a=1;
            long b=0;
            long c=0;
            long d=0;
            long e=0;
            long f=0;
            long g=0;
            long h=0;
            
bool loop=true;

long n=0;


b = 57;
c = b;
if(a==0){
    //jnz 1 5;
    b*= 100;
    b +=100000;
    c= b;
    c +=17000;
    f= 1;
 }
 while(loop){
    loop=false;n++;
    d= 2;
    g=1;
    while(g!=0){
        e= 2;
        g=1;
        while(g!=0){
            g= d;
            g*= e;
            g -=b;
            if(g==0){//jnz g 2;
                f= 0;
            }
            e +=1;
            g= e;
            g -=b;
        }//jnz g -8;
        d +=1;
        g= d;
        g -=b;
    }//jnz g -13;
    if( f==0){
        h +=1;
    }
    g-= b;
    g -=c;
    if(g==0){//jnz g 2;
        //jnz 1 3;
        b +=17;
        loop=true; f=1; 
        if(0 == 0){Console.WriteLine($"{n}: a:{a}\tb:{b}\tc:{c}\td:{d}\te:{e}\tf:{f}\tg:{g}\th:{h}");} 
    }
}


Console.WriteLine(h);

        }
    }
}