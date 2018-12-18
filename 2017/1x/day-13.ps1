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
$scanners

$scand=New-Object -TypeName "System.Collections.Generic.Dictionary``2[int32,object]"
$scanners |%{ $scand[$_.depth] = $_ }
$maxDepth = ($scanners.depth | measure -Maximum).Maximum

$severity = 0

0..$maxDepth|%{
    $mydep = $_

    if($scand.ContainsKey($mydep)){
        $thisscanner = $scand[$mydep]
        Write-Host "scanner found at depth $mydep $thisscanner"
        if ($thisscanner.pos -eq 0){
            $severity += ($thisscanner.range * $thisscanner.depth)
        }
    }
    $scanners | % {
        $_.pos+= $_.dir
        if($_.pos -eq $_.range-1){
            $_.dir=-1
        }elseif ($_.pos -eq 0){
            $_.dir = 1
        }
    }
}

$severity