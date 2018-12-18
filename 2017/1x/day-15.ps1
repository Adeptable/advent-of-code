$ErrorActionPreference='stop'

$a=65
$b=8921

$factors_a=16807
$factors_b=48271
$max = 2147483647

function calc($last, $factor){
    return ($last*$factor)%$max
}
 
#function bitshift($n){  return [int] ([math]::Floor($n * [math]::Pow(2,-16))) }
$chopSize = [System.Math]::pow(2,16)
function chop($n){  return  $n%$chopSize  }

$count=0

0..(40*1000*1000)|%{
    $a = calc $a $factors_a 
    $b = calc $b $factors_b 
    #New-Object psobject -Property @{"gen_a"=$seeds[0];"gen_b"=$seeds[1]}
    if ((chop $a) -eq (chop $b)){
        $count++
    }
}

$count
# $vals | ft gen_a, gen_b

# $vals |%{
#     write-host ([System.Convert]::ToString( (chop $_.gen_a), 2)).padleft(32,'0'[0]) 
#     write-host ([System.Convert]::ToString((chop $_.gen_b), 2)).padleft(32,'0'[0]) 
# Write-Host ""
# }