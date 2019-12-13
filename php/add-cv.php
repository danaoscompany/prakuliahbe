<?php
include 'db.php';
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
$sql = "INSERT INTO cv (user_id, first_name, last_name, profile_picture, last_education, major, school_name, graduation_year, target_university_id, target_university_major, target_savings, description, email, address, phone, whatsapp_number, parent_name, parent_phone) " .
"VALUES (" . $userID . ", '" . $firstName . "', '" . $lastName . "', 'profile_pictures/" . $profilePicture . "', '" . $education . "', '" . $major . "', '" . $schoolName . "', " . $graduationYear . ", " . $targetUniversityID . ", '" . $targetUnivMajor . "', " . $targetSavings. ", '" . $description . "', " .
"'" . $email . "', '" . $address . "', '" . $phone . "', '" . $whatsAppNumber . "', '" . $parentName . "', '" . $parentPhone . "')";
$c->query($sql);
$cvID = mysqli_insert_id($c);
foreach ($certifications as $certification) {
	$c->query("INSERT INTO cv_certifications (cv_id, name) VALUES (" . $cvID . ", '" . $certification["name"] . "')");
}
foreach ($organizations as $organization) {
	$c->query("INSERT INTO cv_organizations (cv_id, name) VALUES (" . $cvID . ", '" . $organization["name"] . "')");
}
foreach ($skills as $skill) {
	$c->query("INSERT INTO cv_skills (cv_id, name) VALUES (" . $cvID . ", '" . $skill["name"] . "')");
}
$sql = "";
foreach ($languages as $language) {
	$sql = "INSERT INTO cv_languages (cv_id, name) VALUES (" . $cvID . ", '" . $language["name"] . "')";
	$c->query($sql);
}
foreach ($experiences as $experience) {
	$c->query("INSERT INTO cv_experiences (cv_id, position, start_date, end_date, city) VALUES (" . $cvID . ", '" . $experience["position"] . "', '" . $experience["start_date"] . "', '" . $experience["end_date"] . "', '" . $experience["city"] . "')");
}
