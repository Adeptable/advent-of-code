$address = 312051

$squareSize = [System.Math]::Ceiling(  [System.Math]::Sqrt($address))

if($squareSize % 2 -eq 0) {$squareSize++}

"address $address is in ring of width $squareSize"

$radialTravel = ($squareSize -1)/2
"radial travel of $radialTravel"

$ringIdx = (($squareSize -1)/2)
$ringStart = ($squareSize-2) * ($squareSize-2) + 1 #wrong for the inner ring (address 1)
$ringEnd = $squareSize*$squareSize
$contentCount = $ringEnd - $ringStart +1
"ring $ringIdx runs from $ringStart to $ringEnd ($contentCount addresses)"

$offset = $address - $ringStart + 1 # from corner
$offsetOneSide = $offset % ($squareSize-1)
$anularTravel = [System.Math]::Abs($offsetOneSide - $ringIdx)
"address $address is $offsetOneSide along the side for a circular travel time of $anularTravel"
"total travel of $($radialTravel+$anularTravel)"
"---"