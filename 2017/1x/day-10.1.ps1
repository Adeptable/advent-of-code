$ErrorActionPreference ='stop'

#$n=5
#[int[]]$list = @(3, 4, 1, 5)
$n=256
#$data=""
#$data="AoC 2017"
$data=gc .\day-10.txt
[int[]]$list = ($data.ToCharArray()|%{[int]$_}) + @(17, 31, 73, 47, 23)

[int[]]$elems = 0..($n-1)
$skipSize=0
$pos=0

$rounds=0..63

$rounds | %{
    $round=$_
    Write-Host "round $_"
    $list |%{
        $len = $_
        #write-host "$elems"
        #write-host "$pos + $len"
        if($len -ne 0)
        {
            $firstSection=$elems | select -Skip $pos -First $len
            $firstLen=$firstSection.length
            $remaining=$len-$firstLen
            $secondSection=$elems | select -First $remaining
            if(-not $firstLen)
            {
                $toReverse = $secondSection
            }elseif(-not $secondsection.length){
                $toReverse =$firstSection
            }else{
                $toReverse=@()+$firstSection+$secondSection
            }
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
        #Write-Host "$elems"
        #write-host "--"
    }
    #Write-Host "$elems"
    #write-host "--"   
}

$hash=""
0..15| %{
    $dense=[int]0;
    $elems | select -skip ($_*16) -First 16 | %{$dense = $dense -bxor $_}

   $hash += $dense.ToString("X")
}

$hash