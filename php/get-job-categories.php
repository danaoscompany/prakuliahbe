<?php
include 'db.php';
mysqli_set_charset($c, "utf8");
$items = [];
$results = $c->query("SELECT * FROM job_categories ORDER BY name ASC");
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($items, $row);
	}
	echo json_encode($items);
} else {
	echo -1;
}