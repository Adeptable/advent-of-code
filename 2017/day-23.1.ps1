$ErrorActionPreference = 'stop'

$data = gc day-23.txt
#$data = gc day-23e.txt

$instr = $data |%{
    $row=$_
    $arg = $row.split(" "[0])

    New-Object psobject -Property @{
        "act" = $arg[0]
        "a" = $arg[1]
        "b" = $arg[2]
        "def" = $row.padright(8)
    }
}

[System.Collections.Generic.Dictionary``2[string, long]]$reg = New-Object -TypeName "System.Collections.Generic.Dictionary``2[string, long]"

$i = 1
$instr | %{$_.a;$_.b} | ?{ $_ -ne $null -and -not [int]::TryParse($_, [ref]$i)} | select -Unique | %{
    $reg.Add($_, 0)
}

$reg["a"]=1

$idx=0

function getval($reg, $arg){
    $val = -1
    if ([int]::TryParse($arg, [ref]$val)){
        return $val
    } else{
        return $reg[$arg]
    }
}

Write-Host "$($instr.Length) instructions parsed"
$op=0

while($idx -ge 0 -and $idx -lt $instr.Length){
    $ins= $instr[$idx]

    switch($ins.act){
        "set"{
            $reg[$ins.a] = getval $reg $ins.b
            $idx++
        }
        "sub"{
            $reg[$ins.a] -= getval $reg $ins.b
            $idx++
        }
        "mul"{
            $reg[$ins.a] *= getval $reg $ins.b
            $idx++
        }
        "jnz"{
            if ((getval $reg $ins.a) -ne 0) 
            {
                $idx += getval $reg $ins.b
            } else{
                $idx++
            }
        }
        default{
            Write-Error "did not understand instruction action ${$ins.act} at $idx"
        }
    }
    $op++
    if($op % 10000 -eq 0)
    {    
        write-host "$op $idx; $($ins.def) > $($reg.Keys | %{ "$_`:$($reg[$_]) " })"
    }   #sleep 1
}

$reg["h"]
#$instr | ft act, a, b