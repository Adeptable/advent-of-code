$ErrorActionPreference = 'stop'

#$data = gc .\day-07e.txt 
$data = gc .\day-07.txt 

Write-Host "found $($data.Length) records"
$inp=$data| %{
  #write-host $_
   # $row = $_  
if(-not   ($_ -match "(\S+) \((\d+)\)( -> (.*))?$")
){ throw "failed to match regex: $row"}
 #$matches.keys | %{ write-host "$_ : $($matches[$_])"  }
 
 if($matches.keys -contains 4){
    $childnames=$matches[4]
 } else{
    $childnames=""
 }

    new-object psobject -Property @{
    "name" = $matches[1];
    "weight"=[int]$matches[2]
    "parent"=$null;
    "childnames"= $childnames.split(", ") |?{$_};
    "children"=@();
    "totalweight"=$null;
    "isbalanced"=$null
    }
}
Write-Host "parsed records"

$inp | %{
    $row=$_
    $row.children = $inp|?{ $row.childnames -contains $_.name }
    if($row.children.length)
    {
        $row.children | %{ $_.parent = $row }
    }
}

write-host "hooked up relationships"

function ensureTotalWeight($row){
    if(-not $row.totalweight){
        
        $row.totalweight = $_.weight

        if($row.children){
            $row.children |%{ 
                ensureTotalWeight $_
                $row.totalweight += $_.totalweight
            }
            $uniquweights= $row.children.totalweight | select -Unique
            #write-host "$($row.name) $uniquweights"
            $row.isbalanced = ($uniquweights.length -eq 1)
        } else {
            $row.isbalanced = $true
        }
    }
}

$inp | %{
    ensureTotalWeight $_
}

Write-Host "propagated weights"

$wonky = $inp|?{
    #$_.isbalanced -and -not $_.parent.isbalanced
    -not $_.isbalanced -and ($_.children | select -expandproperty isbalanced) -notcontains $false
}

$wonky | select name, isbalanced, weight, parent | sort name | ft -AutoSize

$pars = $wonky | select -expand  parent | group name | %{$_.group[0]}
$pars | select name, isbalanced, weight, parent | sort name | ft -AutoSize
$pars | select -expand children  | group name | %{$_.group[0]} | select name, isbalanced, weight, parent | sort name | ft -AutoSize
 
$w =$wonky.children | group totalweight | sort Count
$w

$diff = $w[1].Name-$w[0].Name
$w[0].Group.weight + $diff

