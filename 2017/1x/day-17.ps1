$ErrorActionPreference = 'stop'

$data = 301
#$data = 3
$limit = 2017

#$limit = 10

[System.Collections.ArrayList]$arr = New-Object -TypeName "System.Collections.ArrayList"
$arr.Add(0) | Out-Null
$idx = 0
$insertions = 0
$val=1
while ($insertions -lt $limit){
    #Write-Host "$idx > $arr"
    $advance = $idx+$data 
    $idx = ($advance % $arr.Count) + 1
    #Write-Host "inserting $val at position $idx"
    $arr.Insert($idx,$val)
    #$idx = ($idx + 1) % ($arr.Length)
    $val++
    $insertions++
}

$next = $arr[(($idx+1) % $arr.Count)]
Write-Host "after $insertions insertions, index is $idx and the next number is $next"