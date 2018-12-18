[int[]]$jmp =  gc .\day-05.txt | %{[int]$_}
#[int[]]$jmp = 0,3,0,1,-3
$len = $jmp.length
$idx = 0
$steps =0

$OFS= "`t"
while($idx -ge 0 -and $idx -lt $len){
    #write-host "$jmp"
    #$where = 0..$len | %{ if ($_ -eq $idx){"#"}else{"."}}
    #write-host "$where"
    $act = $jmp[$idx]
    if($act -ge 3){
        $jmp[$idx] = $act-1
    }else{
        $jmp[$idx] = $act+1
    }
    $idx += $act
    $steps++
    if (-not ($steps % 10000)){
        Write-Host "after $steps, $idx"
    }
}

#write-host $jmp
$steps