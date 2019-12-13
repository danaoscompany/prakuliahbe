<?php
include 'db.php';
$start = intval($_POST["start"]);
$length = intval($_POST["length"]);
$results = $c->query("SELECT * FROM jobs LIMIT " . $start . "," . $length);
$jobs = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		$images = $c->query("SELECT * FROM job_images WHERE job_id=" . $row["id"]);
		if ($images && $images->num_rows > 0) {
			$image = $images->fetch_assoc();
			$row["img_path"] = $image["img"];
		}
		$employers = $c->query("SELECT * FROM employers WHERE id=" . $row["employer_id"]);
		if ($employers && $employers->num_rows > 0) {
			$employer = $employers->fetch_assoc();
			$row["employer"] = $employer["full_name"];
			$row["employer_fcm_id"] = $employer["fcm_id"];
		}
		array_push($jobs, $row);
	}
}
echo json_encode($jobs);