<?php
include 'db.php';
mysqli_set_charset($c, "utf8");
$items = [];
$results = $c->query("SELECT * FROM popular_cities");
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		$latitude = doubleval($row["latitude"]);
		$longitude = doubleval($row["longitude"]);
		$jobs = $c->query("SELECT *, SQRT(POW(69.1 * (latitude - " . $latitude . "), 2) + POW(69.1 * (" . $longitude . " - longitude) * COS(latitude / 57.3), 2)) AS distance FROM jobs HAVING distance < 50 ORDER BY distance");
		if ($jobs) {
			$row["jobs_count"] = $jobs->num_rows;
			$totalApplicants = 0;
			while ($job = $jobs->fetch_assoc()) {
				$jobID = intval($job["id"]);
				$applicants = $c->query("SELECT * FROM applications WHERE job_id=" . $jobID);
				if ($applicants) {
					$totalApplicants += $applicants->num_rows;
				}
			}
			$row["applicants_count"] = $totalApplicants;
		} else {
			$row["jobs_count"] = 0;
			$row["applicants_count"] = 0;
		}
		array_push($items, $row);
	}
	echo json_encode($items);
} else {
	echo -1;
}