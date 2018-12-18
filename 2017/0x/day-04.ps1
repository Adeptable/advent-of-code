gc .\day-04.txt |  %{ 
    $words = $_.split(" ")
    #Write-Host $words
    if($words.length -eq (($words | select -Unique).length)){
        1
    }
 } | measure