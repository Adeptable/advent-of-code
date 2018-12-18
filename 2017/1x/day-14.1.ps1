$ErrorActionPreference ='stop'

$data = "uugsqrei"
#$data = "flqrgnkx"

$inp= 0..127|%{
 "$data-$_"
}

Push-Location
cd day-10
$hashes = (& dotnet "run" $inp)
Pop-Location

#$hashes
#$hashes | measure


$bits= $hashes |%{
    #write-host $_
    $asBits = ""
    $_.ToCharArray()|%{
        #write-host "0x$_"
        $int=[int]::Parse("$_",[System.Globalization.NumberStyles]::AllowHexSpecifier )
        $asBits += [System.Convert]::ToString($int, 2).padleft(4,'0'[0])
    }

    $asBits
}
# $bits|%{
#     Write-Host $_
#     #Write-Host "--"
# }

#$bits = $bits | select -first 8 |%{$_.Substring(0,8)}

$empty="0"[0]
$bits=$bits|%{$empty + $_ + $empty}

$bits=@()+"".PadLeft($bits.length+2,$empty) + $bits + "".PadLeft($bits.length+2,$empty)


$dict=New-Object -TypeName "System.Collections.Generic.Dictionary``2[int32,System.Collections.Generic.Dictionary``2[int32,object]]"
$b=0
$bits |%{
    $dict[$b] = New-Object -TypeName "System.Collections.Generic.Dictionary``2[int32,object]"
    $bb=0
    $_.ToCharArray()|%{
        if($_ -eq "0"){
            $dict[$b][$bb]= $null    
        }else{
            $dict[$b][$bb] = 1    
        }
        $bb++
    }
    $b++
}

$xmax=$bits[0].length-2
$ymax=$bits.length-2

$curr = 2

1..($xmax+1)|%{
    $x=$_
    1..($ymax+1)|%{
        $y=$_
    
        if($dict[$x][$y] -eq 1){
            $neighbours = @($dict[$x][$y-1],
                            $dict[$x-1][$y]
                            ) |
                ?{ $_ -ne $null}
            $neighbours = @()+$neighbours

            if($neighbours.Length -eq 0){
                $dict[$x][$y] = New-Object psobject -Property @{"val"=$curr;"friends"=@()}
                $dict[$x][$y].friends = @()+$dict[$x][$y]
                $curr++
            }elseif($neighbours.Length -gt 1){
                $dict[$x][$y] = $neighbours[0]

                if ($neighbours[0].friends -notcontains $neighbours[1])
                {
                    $oldFriends0=$neighbours[0].friends
                    $oldFriends1=$neighbours[1].friends
                    $combined = @()+$neighbours[0].friends + $neighbours[1].friends
                    $combined |%{ $_.friends = $combined; $_.val = $neighbours[0].val }
                }
                #$dupes = @()+$dupes + $neighbours[1]
            } else{
                $dict[$x][$y] = $neighbours[0]
            }
            #Write-Host "$x $y (next $curr ) found neighbours $neighbours"
        }
    }
    write-host "done $x rows, up to group $curr"
}

# $dict.Values|%{
#     $OFS="`t"
#     "$($_.Values)"
# }

($dict.Values |%{$_.Values} | ?{$_ -ne $null} | select -ExpandProperty val | sort -Unique | measure).Count

#$dict.Values.Values |?{$_ -ne 0 -and $dupes -notcontains $_} | select -Unique | measure

#1195 is too high

# $curr= "!"[0]

# $n=0

# 1..$xmax|%{
#     $x=$_
#     1..$ymax|%{
#         $y=$_
    
#         if($bits[$x][$y] -ne $empty){
#             $neighbours = @($bits[$x][$y-1],
#                             #$bits[$x][$y+1],
#                             $bits[$x-1][$y]
#                             #$bits[$x+1][$y]
#                             ) |
#                 ?{ $_ -ne $empty} | sort -Unique
            
#                 if($neighbours.Length -eq 0){
#                     $bits[$x] =  $bits[$x].Substring(0,$y) + $curr + $bits[$x].Substring($y+1)
#                     $curr = [char]::ConvertFromUtf32([char]::ConvertToUtf32("$curr",0)+1)
#                     $n++
#                 }elseif($neighbours.Length -gt 1){
#                     $bits[$x] =  $bits[$x].Substring(0,$y) + $neighbours[0] + $bits[$x].Substring($y+1)
#                     #write-host "replacing $($neighbours[1]) with $($neighbours[0])"
#                     $bits = $bits |%{$_.Replace($neighbours[1],$neighbours[0])}
#                 } else{
#                     $bits[$x] =  $bits[$x].Substring(0,$y) + $neighbours + $bits[$x].Substring($y+1)
#                 }
#                 Write-Host "$x $y (next $curr ) found neighbours $neighbours"
#                 #if( $n%10 -eq 0){ $bits}
#                 #sleep -Milliseconds 250
#         }

#     }
# }

# $bits |%{$_.ToCharArray()}| ?{$_ -ne $empty} | sort -Unique | measure