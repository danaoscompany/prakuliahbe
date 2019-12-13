<?php
include 'db.php';
$name = $_POST["name"];
$idName = $_POST["id_name"];
$id = $_POST["id"];
$items = [];
$sql = "SELECT * FROM " . $name . " WHERE " . $idName . "='" . $id . "'";
$results = $c->query($sql);
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($items, $row);
	}
}
echo json_encode($items);
