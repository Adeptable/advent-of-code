[int[]]$jmp = gc .\day-05.txt | %{[int]$_}

$len = $jmp.length
$idx = 0
$steps =0

$OFS= "`t"
while($idx -ge 0 -and $idx -lt $len){
    #write-host "$jmp"
    #$where = 0..$len | %{ if ($_ -eq $idx){"#"}else{"."}}
    #write-host "$where"
    $act = $jmp[$idx]
    $jmp[$idx] = $act+1
    $idx += $act
    $steps++
    if (-not ($steps % 10000)){
        Write-Host "after $steps, $idx"
    }
}

$steps