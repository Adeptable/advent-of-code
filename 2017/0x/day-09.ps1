$ErrorActionPreference ='stop'

#$data="{{<!!>},{<!!>},{<!!>},{<!!>}}"
$data= gc .\day-09.txt

$score=0
$level=0

$garbage=$false
$skip=$false

$data.ToCharArray()|%{
    if($skip){
        $skip=$false
    }elseif ($garbage -and $_ -eq ">"){
        $garbage=$false
    }
    elseif($garbage -and $_ -eq "!"){
        $skip=$true
    }
    elseif(-not $garbage -and $_ -eq "<"){
        $garbage=$true
    }elseif(-not $garbage -and $_ -eq "{"){
        $level++
        $score+=$level
    }elseif(-not $garbage -and $_ -eq "}"){
        $level--
    }
}

$score