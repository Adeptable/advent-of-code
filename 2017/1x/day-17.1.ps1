$ErrorActionPreference = 'stop'

$data = 301
#$data = 3
$limit = 50000001
#$limit = 8

$idx = 0
$val=1
$sofar = -1
$len = 1

while ($val -lt $limit){
    for ($i = 0; $i -lt 50000; $i++) {    
        $idx = ($idx+$data % $len) + 1
    
        $len++
        if ($idx -eq 1)
        {
            $sofar = $val
        }
        #Write-Host "after $insertions insertions, idx is $idx / $len, zero index is $zeroIdx and the next number is $sofar"
        $val++
    }
    Write-Host "done ~$(($val-1)/1000)k"
}
Write-Host "after $($val-1) insertions, idx is $idx / $len, the next number is $sofar"