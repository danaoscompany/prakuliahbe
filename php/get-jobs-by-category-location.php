<?php
include 'db.php';
$categoryID = intval($_POST["category_id"]);
$start = intval($_POST["start"]);
$length = intval($_POST["length"]);
$latitude = doubleval($_POST["latitude"]);
$longitude = doubleval($_POST["longitude"]);
$results = $c->query("SELECT *, SQRT(POW(69.1 * (latitude - " . $latitude . "), 2) + POW(69.1 * (" . $longitude . " - longitude) * COS(latitude / 57.3), 2)) AS distance FROM jobs WHERE category_id=" . $categoryID . " HAVING distance < 25 ORDER BY distance LIMIT " . $start . "," . $length);
$jobs = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($jobs, $row);
	}
}
echo json_encode($jobs);