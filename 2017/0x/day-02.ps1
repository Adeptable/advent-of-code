$sum = 0

gc ".\day-02.txt" |%{
    $elems = $_.Split('	') | %{[int]$_} | sort

   # "$($elems | select -Last 1) - $($elems | select -first 1)"
    $sum += ($elems | select -Last 1) - ($elems | select -first 1)
}

$sum