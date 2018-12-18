$ErrorActionPreference = 'stop'

$data = gc day-18.txt
#$data = gc day-18e.txt

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

$sound = -1

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

while($idx -ge 0 -and $idx -lt $instr.Length){
    $ins= $instr[$idx]

    switch($ins.act){
        "snd"{
            $sound = getval $reg $ins.a
            $idx++
        }
        "set"{
            $reg[$ins.a] = getval $reg $ins.b
            $idx++
        }
        "add"{
            $reg[$ins.a] += getval $reg $ins.b
            $idx++
        }
        "mul"{
            $reg[$ins.a] *= getval $reg $ins.b
            $idx++
        }
        "mod"{
            $reg[$ins.a] %= getval $reg $ins.b
            $idx++
        }
        "rcv"{
            $a = getval $reg $ins.a
            if($a -ne 0) {
                $reg[$ins.a] = $sound
                return $sound
                exit
            }
            $idx++
        }
        "jgz"{
            if ((getval $reg $ins.a) -gt 0) 
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
    write-host "$idx | $sound; $($ins.def) > $($reg.Keys | %{ "$_`:$($reg[$_]) " })"
    #sleep 1
}

#$instr | ft act, a, b