$ErrorActionPreference = 'stop'
#[int[]]$current= 0, 2, 7, 0
[int[]]$current= (gc .\day-06.txt).split("`t") | %{[int]$_}

[string[]]$seen=@()

$steps = 0
$desc = "$current"
while($seen -notcontains $desc)# -and $steps -le 9)
{
    #write-host $desc
    $seen += $desc
    #$seen|%{"seen $_"}
    
    $max = [int]($current | measure -Maximum).Maximum
    $idx = $current.IndexOf($max)
    $current[$idx]=0
    #write-host "moving $max from $idx"

    #could do this with mod and rem, can't be bothered to math
    $idx++
    while($max){
        $idx=$idx % $current.Length
        $current[$idx] = $current[$idx]+1
        $max--
        $idx++
    }

    $desc = "$current"
    $steps ++
}

write-host $desc
$first = $seen.IndexOf($desc)

"found dupe of $first after $steps"
$steps-$first