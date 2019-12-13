<?php
include 'db.php';
$userID = intval($_POST["user_id"]);
$results = $c->query("SELECT * FROM applications WHERE user_id=" . $userID);
$applications = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		$employers = $c->query("SELECT * FROM employers WHERE id=" . $row["employer_id"]);
		if ($employers && $employers->num_rows > 0) {
			$employer = $employers->fetch_assoc();
			$row["employer_name"] = $employer["full_name"];
		}
		$jobImages = $c->query("SELECT * FROM job_images WHERE job_id=" . $row["job_id"]);
		if ($jobImages && $jobImages->num_rows > 0) {
			$jobImage = $jobImages->fetch_assoc();
			$row["img_path"] = $jobImage["img"];
		}
		$jobs = $c->query("SELECT * FROM jobs WHERE id=" . $row["job_id"]);
		if ($jobs && $jobs->num_rows > 0) {
			$job = $jobs->fetch_assoc();
			$row["job_name"] = $job["title"];
		}
		$users = $c->query("SELECT * FROM users WHERE id=" . $row["user_id"]);
		if ($users && $users->num_rows > 0) {
			$user = $users->fetch_assoc();
			//$row["user_verified"] = $user["verified"];
			$row["employee_name"] = $user["first_name"] . " " . $user["last_name"];
		}
		array_push($applications, $row);
	}
}
echo json_encode($applications);
