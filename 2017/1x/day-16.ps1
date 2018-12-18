$ErrorActionPreference = 'stop'

$size=16
$data=(gc .\day-16.txt).split(","[0]) 

#$size=5
#$data=@("s1","x3/4","pe/b")

$actions=$data|%{
    $row=$_
    #write-host "parsing $row"
    $act=$row.substring(0,1)
    $rem=$row.Substring(1)
    switch ($act){
        "s" {
            New-Object psobject -Property @{
                "def"=$row.padright(6)
                "act"=$act;
                "a"=[int]::parse($rem)
                "b"=$null
            }
        }
        "x"{
            $parts = $rem.split("/"[0])
            New-Object psobject -Property @{
                "def"=$row.padright(6)
                "act"=$act;
                "a"=[int]::parse($parts[0])
                "b"=[int]::parse($parts[1])
            }
        }
        "p"{
            New-Object psobject -Property @{
                "def"=$row.padright(6)
                "act"=$act;
                "a"=$row[1]
                "b"=$row[3]
            }     
        }
        default{
            Write-Error "did not understand action $act from $row"
        }

    }
}

Write-Host "found $($actions.length) actions"

$chars=0..($size-1)|%{
    [char]::ConvertFromUtf32(97+$_)
}


#$actions | select def, act, a, b |ft

$n=0
write-host "     > $chars"
$actions |%{
    $do=$_
    switch($do.act){
        "s"{
            $end = $chars | select -last $do.a
            $start = $chars | select -SkipLast $do.a
            $chars = @() + $end + $start
        }
        "x"{
            $tmp = $chars[$do.a]
            $chars[$do.a] = $chars[$do.b]
            $chars[$do.b] = $tmp
        }
        "p"{
            $ix1=$chars.IndexOf($do.a)
            $ix2=$chars.IndexOf($do.b)
            $chars[$ix1] = $do.b
            $chars[$ix2] = $do.a
        }
        default{
            Write-Error "did not understand action $($do.act) from $($do.def)"
        }
    }

    if($n%10 -eq 0)
    {Write-Host "$($do.def) > $chars"}
    $n++
}

$ofs=""
"$chars"
#not nkmfhecjilpodbga