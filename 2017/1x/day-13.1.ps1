$ErrorActionPreference='stop'

$data = gc .\day-13.txt
#$data = gc .\day-13e.txt

$scanners = $data | % {
    $row=$_
    $parsed = $row -match "(\d+): (\d+)$"
    
    if(-not $parsed){
        write-error "failed to parse $row"
    }

    New-Object psobject -Property @{
        "depth"=[int]$Matches[1]
        "range"=[int]$matches[2]
        "pos"=0
        "dir"=1
    }
}

function advance($scanners){
    $scanners | % {
        $_.pos+= $_.dir
        if($_.pos -eq $_.range-1){
            $_.dir=-1
        }elseif ($_.pos -eq 0){
            $_.dir = 1
        }
    }
}

function run(){
    $gothit = $false
    $mydep=0
    while($mydep -le $maxDepth -and -not $gothit){
        if($scand.ContainsKey($mydep)){
            $thisscanner = $scand[$mydep]
            #Write-Host "scanner found at depth $mydep $thisscanner"
            if ($thisscanner.pos -eq 0){
                write-host "hit at $mydep"
                $gothit = $true
            }
        }
        advance $scanners
        $mydep++
    }
    return $gothit 
}


$scand=New-Object -TypeName "System.Collections.Generic.Dictionary``2[int32,object]"
$scanners |%{ $scand[$_.depth] = $_ }
$maxDepth = ($scanners.depth | measure -Maximum).Maximum

$delay=0
$success = $false

while(-not $success){
    $scanners |%{
        $_.pos=0
        $_.dir=1
    }

    if($delay){
        0..($delay-1)|%{
            advance $scanners
        }
    }

    Write-Host "trying with delay $delay"

 $gothit=   run
 
    $success = -not $gothit
    $delay++
}

$delay-1