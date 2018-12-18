$ErrorActionPreference = 'stop'


$data = gc .\day-20.txt
#$data = gc .\day-20e.txt

$pidx =0

$particles = $data | %{
    $row = $_
    $items = $row.Split(' '[0])

    $tuples = $items | %{ 
        $tupstr = $_
        #Write-Host "parsing tuple $tupstr"

        $good = $tupstr -match "([pva])\=\<(-?\d+),(-?\d+),(-?\d+)\>,?"
        if ( -not $good){
            Write-Error "could not parse tuple: '$tupstr'"
        }
        
        New-Object psobject -Property @{
             "name"=$Matches[1]
             "x"=[int]::parse($Matches[2])
             "y"=[int]::parse($Matches[3])
             "z"=[int]::parse($Matches[4])
         }
     }
     
     $res = @{}
     $tuples | %{
         $t = $_
         $res.Add($t.name,$t)
     }
     $res.Add("id", $pidx)
     $pidx++
     New-Object psobject -Property $res
}

$particles |%{ 
    $p=$_
    New-Object psobject -Property @{
        "part"=$p
        "acc"= [math]::abs($p.a.x)+[math]::abs($p.a.y)+[math]::abs($p.a.z)
    }
} | sort -Property acc |# select -Property acc -ExpandProperty "part"
 select -First 1 -ExpandProperty part #| select -ExpandProperty id

#661 too high