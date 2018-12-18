$ErrorActionPreference = 'stop'

$data = gc .\day-25.txt
#$data = gc .\day-25e.txt

#$data | measure

$instr = New-Object -TypeName "System.Collections.Generic.Dictionary``2[string,System.Collections.Generic.Dictionary``2[int,object]]"
$data | % {
    $line = $_
#    Write-Host "$line"
    if ($line -eq ""){
    } elseif($line.startsWith("Begin in state ")){
        $beginState = $line.Substring("Begin in state".Length+1).Trim(".")
    } elseif($line -match "Perform a diagnostic checksum after (\d+) steps\."){
        $checksumAfter=[int]::Parse($Matches[1])
    } elseif($line -match "In state (.+):"){
        $currState=$Matches[1]
         $instr[$currState]= New-Object -TypeName "System.Collections.Generic.Dictionary``2[int,object]"
    } elseif($line -match "  If the current value is (\d):"){
        $currVal = $Matches[1]
        $instr[$currState][$currVal] = New-Object psobject -Property @{ "write"=$null; "move"=$null; "cont"=$null } 
    } elseif($line -match "Write the value (\d)\."){
        $instr[$currState][$currVal].write = $Matches[1]
    } elseif($line -match "Move one slot to the (.*)\."){
        switch($Matches[1]){
            "right" {
                $instr[$currState][$currVal].move = +1
            }
            "left" {
                $instr[$currState][$currVal].move = -1
            }
            default{Write-Error "did not understand move: $($Matches[1])"} 
        }
        
    } elseif($line -match "Continue with state (.)."){
        $instr[$currState][$currVal].cont = $Matches[1]
    } else{
        Write-Error "Unparsed line: $line"
    }
}

#write-host "$beginState $checksumAfter"
#$instr

$pos=8000
$tapeLen = 16000
$tape = 0..$tapeLen |%{0}
$state=$beginState
#write-host "$state $pos | $tape"

$w=0
$step = 1
while($step -lt $checksumAfter){
    if($pos -lt 0 -or $pos -ge $tapeLen){
        Write-Error "ran out of tape after $($step/$checksumAfter) at position $pos"
    }

    if($w -ge 100000){
        Write-host "progress: $($step/$checksumAfter)"     
        $w=0
    }
    $w++

    $act=$instr[$state][$tape[$pos]]

    $tape[$pos] = $act.write
    $pos+=$act.move
    $state = $act.cont
#    write-host "$state $pos | $tape"
    $step++
}
write-host "Done processing"
#write-host "$tape"
($tape |?{$_ -eq 1} | measure).Count

#200 too low
#3577 too low