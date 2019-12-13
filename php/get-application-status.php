<?php
include 'db.php';
$jobID = intval($_POST["job_id"]);
$userID = intval($_POST["user_id"]);
$results = $c->query("SELECT * FROM applications WHERE job_id=" . $jobID . " AND user_id=" . $userID . " ORDER BY id DESC LIMIT 1");
if ($results && $results->num_rows > 0) {
	$row = $results->fetch_assoc();
	echo $row["status"];
} else {
	echo -1;
}