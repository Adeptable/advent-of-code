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
    "weight"=$matches[2]
    "parent"=$null;
    "childnames"= $childnames.split(", ") |?{$_}
    "children"=@()
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

($inp |? {-not $_.parent}).name