$ErrorActionPreference='stop'

$data = gc .\day-13.txt
#$data = gc .\day-13e.txt

$scanners = $data | % {
    $row=$_
    $parsed = $row -match "(\d+): (\d+)$"
    
    if(-not $parsed){
        write-error "failed to parse $row"
    }

    $range=[int]$matches[2]

    New-Object psobject -Property @{
        "depth"=[int]$Matches[1]
        "range"=$range
        "cycle"=($range-1)*2
    }
}

Write-Host "unique cycles: $($scanners.cycle | sort -Unique)"

$delay=0
$success = $false

$len = $scanners.length

while(-not $success){
#while($delay -eq 0){
   if($delay % 10000 -eq 0) {Write-Host "trying with delay $($delay.tostring("n"))"}

    $s=0
    $hit=$false
    while($s -lt $len -and -not $hit)
    { 
        $scan=$scanners[$s]
        $time=$scan.depth + $delay
        $pos = $time % $scan.cycle
        $hit = $pos -eq 0
        $s++
    }

    $success = -not $hit
    $delay++
    #write-host "$scannerpos"
}

#$success
$delay-1