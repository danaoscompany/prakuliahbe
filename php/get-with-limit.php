<?php
include 'db.php';
mysqli_set_charset($c, "utf8");
$name = $_POST["name"];
$start = intval($_POST["start"]);
$length = intval($_POST["length"]);
$items = [];
$results = $c->query("SELECT * FROM " . $name . " LIMIT " . $start . "," . $length);
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($items, $row);
	}
	echo json_encode($items);
} else {
	echo -1;
}