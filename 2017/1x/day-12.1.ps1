$ErrorActionPreference='stop'

$data=gc .\day-12.txt
#$data=gc .\day-12e.txt

Write-Host "$($data.Length) records"

$pipes=New-Object -TypeName "System.Collections.Generic.Dictionary``2[string,[System.Collections.Generic.List``1[string]]]"

$data|% {
    $hasmatch=$_ -match "(\S+) <-> (.*)$"
    if(-not $hasmatch){
        Write-Error "failed to match $_"
    }
$pipes.Add(
        $matches[1],
        ($matches[2].split(",")|%{$_.trim()})
        )

    # New-Object psobject -Property @{
    #     "from"=$matches[1]
    #     "tokeys"=$matches[2].split(",")|%{$_.trim()}
    #     "to"=@()
    # }
}

# $pipes |%{
#     $p=$_
#     $p.to=$pipes|?{
#         $p.tokeys -contains $_.from
#     }
# }

$groups=0
while ($pipes.Count ){#-and $groups -lt 1){
    [System.Collections.ArrayList]$visited=@();
    
    $root = $pipes.Keys | select -First 1

    $toConsider=@($root)

    while($toConsider.Count){
        #Start-Sleep -Seconds 1
        $look = (@()+$toConsider)[0]
        $toConsider = $toconsider | select -Skip 1
        
        $visited.Add($look) | out-null
        if($pipes[$look].Count)
        {
            $toConsider=@()+$toConsider +$pipes[$look] | ?{ $visited -notcontains $_ } | select -Unique
        }
        #write-host "$look {$($pipes[$look])} > $visited ($toconsider)"    
        #write-host "$look > $($visited.Count) ($($toconsider.Length))"    
        write-host "$look > $($pipes.Count) / $($visited.Count) ($($toconsider))"    
    }
    $visited |%{ $pipes.Remove($_)} | Out-Null
    $groups++
}
$groups