<?php
include 'db.php';
$jobID = intval($_POST["job_id"]);
$results = $c->query("SELECT * FROM job_images WHERE job_id=" . $jobID);
$images = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($images, $row);
	}
}
echo json_encode($images);