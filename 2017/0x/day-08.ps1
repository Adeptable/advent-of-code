$ErrorActionPreference = 'stop'

#$data = gc .\day-08e.txt
$data = gc .\day-08.txt

$instructions=$data|%{
    $parts = $_.split(' ')
    
    if($parts[1] -eq "inc"){
        $mul=[int]1
    }else{
        $mul=[int]-1
    }
    
    New-Object psobject -Property @{
        "target"=$parts[0]
        "delta"=([int]$parts[2])*$mul
        "read"=$parts[4]
        "op"=$parts[5]
        "comparer"=[int]$parts[6]
    }
}

$registers=@{}

#$instructions

function testop($inst){
    $val=$registers[$inst.read]
    #Write-Host "$val $($inst.op) $($inst.comparer)"
      switch($inst.op){
        ">"{ $val -gt $inst.comparer }
        "<"{ $val -lt $inst.comparer }
        ">="{ $val -ge $inst.comparer }
        "<="{ $val -le $inst.comparer }
        "=="{ $val -eq $inst.comparer }
        "!="{ $val -ne $inst.comparer }
        default{
                Write-Error "did not understand operation $($inst.op)"
            }
        }
}

$instructions |%{
    $inst=$_

    @($inst.read, $inst.target)|%{
        if(-not $registers.ContainsKey($_)){
            $registers[$_]=0
        }
    }
    
    if (testop $inst){
        $registers[$inst.target] += $inst.delta
   #     $registers
 #       Write-Host "---"    
    }else{
  #      Write-Host "skip"
    }
}

$registers.Values | measure -Maximum