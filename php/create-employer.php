<?php
include 'db.php';
include 'query.php';
$fullName = $_POST["full_name"];
$companyName = $_POST["company_name"];
$email = $_POST["email"];
$password = $_POST["password"];
$phone = $_POST["phone"];
$website = $_POST["website"];
$cardPicture = $_POST["card_picture"];
$biodata = $_POST["biodata"];
$latitude = doubleval($_POST["latitude"]);
$longitude = doubleval($_POST["longitude"]);
$googleUserID = $_POST["google_user_id"];
$facebookUserID = $_POST["facebook_user_id"];
$lastIP = $_POST["last_ip"];
$deviceName = $_POST["device_name"];
$lastAccess = date('Y:m:d H:i:s');
if (queryString($c, "employers", "email", $email)) {
	echo -1;
} else if (query($c, "employers", "phone", $phone)) {
	echo -2;
} else {
	$c->query("INSERT INTO employers (full_name, company_name, card_picture, website, email, password, phone, biodata, creation_date, latitude, longitude, google_user_id, facebook_user_id, last_ip, device_name, last_access) VALUES ('" . $fullName . "', '" . $companyName . "', '" . $cardPicture . "', '" . $website . "', '" . $email . "', '" . $password . "', '" . $phone . "', '" . $biodata . "', '" . $lastAccess . "', " . $latitude . ", " . $longitude . ", '" . $googleUserID . "','" . $facebookUserID . "', '" . $lastIP . "', '" . $deviceName . "', '" . $lastAccess . "')");
	$id = mysqli_insert_id($c);
	echo json_encode($c->query("SELECT * FROM employers WHERE id=" . $id)->fetch_assoc());
}