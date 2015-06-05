<?php

	//$obj = $_POST['obj'];

	//$string = json_decode($_POST['obj']);
	//$array=json_decode($_POST['obj'], true);
	//$array = array('asdwadw','dsadasdas','dsadsadsad');
	//$array = $_POST['obj'];
	//$result = eval('('+$array+')');
	//echo $array->A; // prints 'bar'
	//echo "{$array->A}\n";
	//$encodedArray = json_encode($array);
	require 'connect.php';
	$username = $_POST['name'];

	$array = json_decode($_POST['obj'], true);

	$size = sizeof($array);

	$lat = $array[0]['A'];
	$lon = $array[0]['F'];

	echo "Coordinates\n";

	for ($i=1; $i < $size; $i++) { 

		echo $array[($i-1)]['A'].",".$array[($i-1)]['F']."\n";
		$lat = $lat.",".$array[$i]['A'];
		$lon = $lon.",".$array[$i]['F'];
	}

	echo "Latitudes\n";
	echo $lat."\n";
	
	echo "Longitudes\n";
	echo $lon;

	$settings = array(
	'username' => $username,
	'lat' => $lat,
	'lon' => $lon
	);
	$database -> insertRow('location',$settings);

?>