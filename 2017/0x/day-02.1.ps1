$sum = 0

gc ".\day-02.txt" |%{
    $elems = $_.Split('	') | %{[int]$_}

    $elems | % {
        $a=$_;
        $elems | %{
            if ((($a % $_) -eq 0) -and ($a -ne $_)){
                $num = ($a / $_)
                write-host "found $a and $_ : $num"
                $sum += $num
            }
        }
    }
}

$sum