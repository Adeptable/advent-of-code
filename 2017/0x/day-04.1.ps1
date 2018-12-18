$ofs=""

gc .\day-04.txt  | %{ 
    $words = $_.split(" ") | % {
        $sorted =  $_.ToCharArray() | sort
        "$sorted"
     }
    #Write-Host $words
    if($words.length -eq (($words | select -Unique).length)){
        1
    }
 } | measure