<?php
include 'db.php';
include 'common.php';
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$email = $_POST["email"];
$password = $_POST["password"];
$phone = $_POST["phone"];
$profilePicture = $_POST["profile_picture"];
$ip = getIP();
$c->query("INSERT INTO admins (email, password, first_name, last_name, phone, profile_picture, creation_date, last_ip, last_access) VALUES ('" . $email . "', '" . $password . "', '" . $firstName . "', '" . $lastName . "', '" . $phone . "', '" . $profilePicture . "', '" . date('Y:m:d H:i:s') . "', '" . $ip . "', '" . date('Y:m:d H:i:s') . "')");