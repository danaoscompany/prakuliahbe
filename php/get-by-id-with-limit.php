<?php
include 'db.php';
mysqli_set_charset($c, "utf8");
$name = $_POST["name"];
$start = intval($_POST["start"]);
$length = intval($_POST["length"]);
$id = intval($_POST["id"]);
$items = [];
$sql = "SELECT * FROM " . $name . " WHERE id=" . $id . " LIMIT " . $start . "," . $length;
$results = $c->query($sql);
if ($results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($items, $row);
	}
	echo json_encode($items);
} else {
	echo -1;
}