$ErrorActionPreference='stop'

$data="ne,ne,ne"
$data="ne,ne,sw,sw"
$data="ne,ne,s,s"
$data="se,sw,se,sw,sw"
$data=gc .\day-11.txt

$steps =$data.Split(",")

$maxdist=0

[System.Collections.ArrayList]$route=@()

$step=0
$steplen=$steps.Count
$steps |%{
    $step++
      write-host "$step of $steplen"
    $route+=$_
    $todo=$true
   
    while($todo){
        $todo=$false
        while($route -contains "n" -and $route -contains "s"){
            $route.Remove("n")
            $route.Remove("s")
            $todo=$true
            #write-host "n-s"
        }
        
        while($route -contains "ne" -and $route -contains "sw"){
            $route.Remove("ne")
            $route.Remove("sw")
            $todo=$true
            #write-host "ne-sw"
        }
        
        while($route -contains "nw" -and $route -contains "se"){
            $route.Remove("nw")
            $route.Remove("se")
            $todo=$true
            #write-host "nw-se"
        }
        
        while($route -contains "n" -and $route -contains "sw"){
            $route.Remove("n")
            $route.Remove("sw")
            $route.Add("nw") | Out-Null
            $todo=$true
            #write-host "n-sw>nw"
        }

        while($route -contains "n" -and $route -contains "se"){
            $route.Remove("n")
            $route.Remove("se")
            $route.Add("ne") | Out-Null
            $todo=$true
            #write-host "n-se>ne"
        }
        while($route -contains "s" -and $route -contains "nw"){
            $route.Remove("s")
            $route.Remove("nw")
            $route.Add("sw") | Out-Null
            $todo=$true
            #write-host "s-nw>sw"
        }
        while($route -contains "s" -and $route -contains "ne"){
            $route.Remove("s")
            $route.Remove("ne")
            $route.Add("se") | Out-Null
            $todo=$true
            #write-host "s-ne>se"
        }
        while($route -contains "se" -and $route -contains "sw"){
            $route.Remove("se")
            $route.Remove("sw")
            $route.Add("s") | Out-Null
            $todo=$true
            #write-host "se-sw>s"
        }
        while($route -contains "ne" -and $route -contains "nw"){
            $route.Remove("ne")
            $route.Remove("nw")
            $route.Add("n") | Out-Null
            $todo=$true
            #write-host "ne-nw>n"
        }
    }

    $dist=$route.Count
    if($dist -gt $maxdist){
        $maxdist = $dist
    }
}

$maxdist