<?php
include 'db.php';
$cvID = intval($_POST["id"]);
$userID = intval($_POST["user_id"]);
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$education = $_POST["education"];
$major = $_POST["major"];
$schoolName = $_POST["school_name"];
$graduationYear = intval($_POST["graduation_year"]);
$targetUniversityID = intval($_POST["target_university_id"]);
$targetUnivMajor = $_POST["target_university_major"];
$targetSavings = intval($_POST["target_savings"]);
$description = $_POST["description"];
$email = $_POST["email"];
$address = $_POST["address"];
$phone = $_POST["phone"];
$whatsAppNumber = $_POST["whatsapp_number"];
$parentName = $_POST["parent_name"];
$parentPhone = $_POST["parent_phone"];
$profilePicture = $_POST["profile_picture"];
$certifications = json_decode($_POST["certifications"], true);
$organizations = json_decode($_POST["organizations"], true);
$skills = json_decode($_POST["skills"], true);
$languages = json_decode($_POST["languages"], true);
$experiences = json_decode($_POST["experiences"], true);

$c->query("UPDATE cv SET user_id=" . $userID . ", first_name='" . $firstName . "', last_name='" . $lastName . "', last_education='" . $education . "', major='" . $major . "', school_name='" . $schoolName . "', graduation_year=" . $graduationYear . ", target_university_id=" . $targetUniversityID . ", target_university_major='" . $targetUnivMajor . "', target_savings=" . $targetSavings . ", description='" . $description . "', email='" . $email . "', address='" . $address . "', phone='" . $phone . "', whatsapp_number='" . $whatsAppNumber . "', parent_name='" . $parentName . "', parent_phone='" . $parentPhone . "', profile_picture='" . $profilePicture . "' WHERE id=" . $cvID);

foreach ($certifications as $certification) {
	$results = $c->query("SELECT * FROM cv_certifications WHERE id=" . $certification["id"]);
	if ($results && $results->num_rows > 0) {
		$row = $results->fetch_assoc();
		$c->query("UPDATE cv_certifications SET name='" . $certification["name"] . "' WHERE id=" . $row["id"]);
	} else {
		$c->query("INSERT INTO cv_certifications (cv_id, name) VALUES (" . $cvID . ", '" . $certification["name"] . "')");
	}
}

foreach ($organizations as $organization) {
	$results = $c->query("SELECT * FROM cv_organizations WHERE id=" . $organization["id"]);
	if ($results && $results->num_rows > 0) {
		$row = $results->fetch_assoc();
		$c->query("UPDATE cv_organizations SET name='" . $organization["name"] . "' WHERE id=" . $row["id"]);
	} else {
		$c->query("INSERT INTO cv_organizations (cv_id, name) VALUES (" . $cvID . ", '" . $organization["name"] . "')");
	}
}

foreach ($skills as $skill) {
	$results = $c->query("SELECT * FROM cv_skills WHERE id=" . $skill["id"]);
	if ($results && $results->num_rows > 0) {
		$row = $results->fetch_assoc();
		$c->query("UPDATE cv_skills SET name='" . $skill["name"] . "' WHERE id=" . $row["id"]);
	} else {
		$c->query("INSERT INTO cv_skills (cv_id, name) VALUES (" . $cvID . ", '" . $skill["name"] . "')");
	}
}

foreach ($languages as $language) {
	$results = $c->query("SELECT * FROM cv_languages WHERE id=" . $language["id"]);
	if ($results && $results->num_rows > 0) {
		$row = $results->fetch_assoc();
		$c->query("UPDATE cv_languages SET name='" . $language["name"] . "' WHERE id=" . $row["id"]);
	} else {
		$c->query("INSERT INTO cv_languages (cv_id, name, level) VALUES (" . $cvID . ", '" . $language["name"] . "', " . $language["level"] . ")");
	}
}

foreach ($experiences as $experience) {
	$results = $c->query("SELECT * FROM cv_experiences WHERE id=" . $experience["id"]);
	if ($results && $results->num_rows > 0) {
		$row = $results->fetch_assoc();
		$c->query("UPDATE cv_experiences SET position='" . $experience["position"] . "', start_date='" . $experience["start_date"] . "', end_date='" . $experience["end_date"] . "', city='" . $experience["city"] . "' WHERE id=" . $row["id"]);
	} else {
		$c->query("INSERT INTO cv_experiences (cv_id, position, start_date, end_date, city) VALUES (" . $cvID . ", '" . $experience["position"] . "', '" . $experience["start_date"] . "', '" . $experience["end_date"] . "', '" . $experience["city"] . "')");
	}
}
