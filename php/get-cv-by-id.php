<?php
include 'db.php';
mysqli_set_charset($c, "utf8");
$id = intval($_POST["id"]);
$items = [];
$sql = "SELECT * FROM cv WHERE id=" . $id;
$results = $c->query($sql);
if ($results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		$users = $c->query("SELECT * FROM users WHERE id=" . $row["user_id"]);
		if ($users && $users->num_rows > 0) {
			$user = $users->fetch_assoc();
			$row["verified"] = $user["verified"];
			$row["user_info"] = json_encode($user);
		}
		$univs = $c->query("SELECT * FROM universities WHERE id=" . $row["target_university_id"]);
		if ($univs && $univs->num_rows > 0) {
			$univ = $univs->fetch_assoc();
			$row["target_university_name"] = $univ["name"];
		}
		$certifications = $c->query("SELECT * FROM cv_certifications WHERE cv_id=" . $row["id"]);
		if ($certifications && $certifications->num_rows > 0) {
			$certificationsJSON = [];
			while ($certification = $certifications->fetch_assoc()) {
				array_push($certificationsJSON, $certification);
			}
			$row["certifications"] = json_encode($certificationsJSON);
		}
		$organizations = $c->query("SELECT * FROM cv_organizations WHERE cv_id=" . $row["id"]);
		if ($organizations && $organizations->num_rows > 0) {
			$organizationsJSON = [];
			while ($organization = $organizations->fetch_assoc()) {
				array_push($organizationsJSON, $organization);
			}
			$row["organizations"] = json_encode($organizationsJSON);
		}
		$skills = $c->query("SELECT * FROM cv_skills WHERE cv_id=" . $row["id"]);
		if ($skills && $skills->num_rows > 0) {
			$skillsJSON = [];
			while ($skill = $skills->fetch_assoc()) {
				array_push($skillsJSON, $skill);
			}
			$row["skills"] = json_encode($skillsJSON);
		}
		$languages = $c->query("SELECT * FROM cv_languages WHERE cv_id=" . $row["id"]);
		if ($languages && $languages->num_rows > 0) {
			$languagesJSON = [];
			while ($language = $languages->fetch_assoc()) {
				array_push($languagesJSON, $language);
			}
			$row["languages"] = json_encode($languagesJSON);
		}
		$experiences = $c->query("SELECT * FROM cv_experiences WHERE cv_id=" . $row["id"]);
		if ($experiences && $experiences->num_rows > 0) {
			$experiencesJSON = [];
			while ($experience = $experiences->fetch_assoc()) {
				array_push($experiencesJSON, $experience);
			}
			$row["experiences"] = json_encode($experiencesJSON);
		}
		array_push($items, $row);
	}
	echo json_encode($items);
} else {
	echo -1;
}
