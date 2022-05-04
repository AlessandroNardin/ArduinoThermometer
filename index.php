<?php
$myfile = fopen("newfile.txt", "r");
$tempr = fgets($myfile);
fclose($myfile);

# 06/01/22 04:11:05
$jsonobj = '{"Head":{"Timestamp":"' . date("d M Y H:i:s") . '"},"Body":{"Data":{"TEMP":{"Value":"' . $tempr . '","Unit":"°C"}}}}';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
echo json_encode(json_decode($jsonobj));
exit();
?>