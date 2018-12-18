$ErrorActionPreference ='stop'

#$n=5
#[int[]]$list = @(3, 4, 1, 5)
$n=256
[int[]]$list = @(187,254,0,81,169,219,1,190,19,102,255,56,46,32,2,216)

[int[]]$elems = 0..($n-1)
$skipSize=0
$pos=0

$list |%{
    $len = $_
    write-host "$elems"
    write-host "$pos + $len"
    if($len -ne 0)
    {
        $firstSection=$elems | select -Skip $pos -First $len
        $firstLen=$firstSection.length
        $remaining=$len-$firstLen
        $secondSection=$elems | select -First $remaining

        $toReverse=$firstSection+$secondSection
        #write-host "$firstsection + $secondsection = $toReverse (len $len)"
        [system.array]::Reverse($toReverse)
        #Write-Host "$toreverse"
        $rPos=$pos
        $toReverse | select -First $firstLen | %{
            $elems[$rPos] = $_
            $rpos++
        }
        $rpos=0
        $toReverse | select -Skip $firstLen | %{
            $elems[$rPos] = $_
            $rpos++
        }
    }
    $pos = ($pos + $len + $skipSize) % $n
    $skipSize++
    Write-Host "$elems"
    write-host "--"
}

$elems[0]*$elems[1]