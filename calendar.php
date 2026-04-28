<?php
if(isset($_GET['month']) && isset($_GET['year'])){
  $month = intval($_GET['month']);
  $year = intval($_GET['year']);
}else{
  $month = 3;
  $year = 2026;
}

$today = ['year'=>2026,'month'=>3,'day'=>11];
$timestamp = mktime(0,0,0,$month,1,$year);
$monthName = date("F",$timestamp);

$prevMonth = $month-1; $prevYear=$year;
if($prevMonth<1){ $prevMonth=12; $prevYear--; }
$nextMonth=$month+1; $nextYear=$year;
if($nextMonth>12){ $nextMonth=1; $nextYear++; }

echo "<table>";
echo "<tr style='background:#2563eb;color:white;font-weight:bold;'>";
echo "<td onclick=\"loadCalendar($prevMonth,$prevYear,this)\" style='cursor:pointer;'>⬅</td>";
echo "<td colspan='5'>$monthName $year</td>";
echo "<td onclick=\"loadCalendar($nextMonth,$nextYear,this)\" style='cursor:pointer;'>➡</td>";
echo "</tr>";

echo "<tr style='background:#60a5fa;color:white;font-weight:bold;'>
<td>Su</td><td>M</td><td>Tu</td><td>W</td><td>Th</td><td>F</td><td>Sa</td></tr>";

$startDay = date("w",$timestamp);
$daysInMonth = date("t",$timestamp);
$currentDay = 1;

echo "<tr>";
for($i=0;$i<$startDay;$i++) echo "<td></td>";
for($i=$startDay;$i<7;$i++){
  $fullDate="$year-$month-$currentDay";
  $bg = ($year==$today['year'] && $month==$today['month'] && $currentDay==$today['day']) ? "#34d399" : "#A2BAFA";
  echo "<td onclick=\"openNote('$fullDate',this)\" style='cursor:pointer;background:$bg;'>$currentDay</td>";
  $currentDay++;
}
echo "</tr>";

while($currentDay <= $daysInMonth){
  echo "<tr>";
  for($i=0;$i<7;$i++){
    if($currentDay <= $daysInMonth){
      $fullDate="$year-$month-$currentDay";
      $bg = ($year==$today['year'] && $month==$today['month'] && $currentDay==$today['day']) ? "#34d399" : "#A2BAFA";
      echo "<td onclick=\"openNote('$fullDate',this)\" style='cursor:pointer;background:$bg;'>$currentDay</td>";
      $currentDay++;
    }else echo "<td></td>";
  }
  echo "</tr>";
}
echo "</table>";
?>