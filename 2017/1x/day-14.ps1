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
$bits.ToCharArray()|?{$_ -eq "1"} | measure