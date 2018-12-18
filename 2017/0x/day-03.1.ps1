$address = 312051

$values = @{}

$x=5
$y=6
$idx=1
$dir="R"
$walkFor=1
$ringSize=0

$sum = -1

while ($sum -le $address){
    $key="$x,$y"  

    $neighbours = "$($x-1),$($y-1)","$($x-1),$($y-0)","$($x-1),$($y+1)",
                  "$($x-0),$($y-1)",                  "$($x-0),$($y+1)",
                  "$($x+1),$($y-1)","$($x+1),$($y-0)","$($x+1),$($y+1)"
    
    $sum = 0
    if($idx -eq 1) {$sum=1}
    $neighbours | %{ $sum += $values[$_].val } 

    $values[$key] = New-Object psobject -Property  @{"x"=$x;"y"=$y;"idx"=$idx;"val"=$sum}

    switch ($dir) {
        "L" { 
            $x--
         }
         "R"{
             $x++
         }
         "U"{
             $y--
         }
         "D"{
             $y++
         }
        Default { throw $dir }
    }
    $walkFor--
    if($walkFor -eq 0){
        
        switch ($dir) {
            "L" { 
                $dir="D"
                $walkFor = $ringSize
             }
            "R"{
                $dir="U" 
                $ringSize+=2
                $walkFor = $ringSize-1
            }
            "U"{
                $dir="L"
                $walkFor = $ringSize
            }
            "D"{
                $dir="R"
                $walkFor = $ringSize+1
            }
            Default { throw $dir }
        }
    }


    $idx++
}
$values.Values | group y | sort Name |  %{

    [System.String]::Join("  ",  
    ($_.Group | sort x | select -ExpandProperty val | %{$_.tostring().PadLeft(6," ")}
    )  
    )
}
 