<?php
include 'db.php';
$categoryID = intval($_POST["category_id"]);
$start = intval($_POST["start"]);
$length = intval($_POST["length"]);
$results = $c->query("SELECT * FROM jobs WHERE category_id=" . $categoryID . " LIMIT " . $start . "," . $length);
$jobs = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($jobs, $row);
	}
}
echo json_encode($jobs);