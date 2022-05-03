<?php
$temp = $_GET["temperature"];
var_dump($temp);
$myfile = fopen("newfile.txt", "w");
fwrite($myfile, $temp);
fclose($myfile);
?>