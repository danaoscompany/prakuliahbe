<?php
include 'db.php';
$results = $c->query("SELECT * FROM jobs");
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
		$cities = $c->query("SELECT * FROM popular_cities WHERE id=" . $row["city_id"]);
		if ($cities && $cities->num_rows > 0) {
		    $city = $cities->fetch_assoc();
		    $row["city"] = $city["name"];
        }
		$categories = $c->query("SELECT * FROM job_categories WHERE id=" . $row["category_id"]);
		if ($categories && $categories->num_rows > 0) {
		    $category = $categories->fetch_assoc();
		    $row["category"] = $category["name"];
        }
		array_push($jobs, $row);
	}
}
echo json_encode($jobs);