<?php
include 'db.php';
include 'common.php';
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$phone = $_POST["phone"];
$email = $_POST["email"];
$password = $_POST["password"];
$nim = $_POST["nim"];
$va = $_POST["va"];
$profilePictureSet = intval($_POST["profile_picture_set"]);
$profilePictureURL = $_POST["profile_picture_url"];
$results = $c->query("SELECT * FROM users WHERE email='" . $email . "'");
if ($results && $results->num_rows > 0) {
    echo -2;
    return;
}
$results = $c->query("SELECT * FROM users WHERE phone='" . $phone . "'");
if ($results && $results->num_rows > 0) {
    echo -3;
    return;
}
$results = $c->query("SELECT * FROM users WHERE nim='" . $nim . "'");
if ($results && $results->num_rows > 0) {
    echo -4;
    return;
}
$sql = "INSERT INTO users (email, password, first_name, last_name, phone, profile_picture, creation_date, last_ip, last_access, nim, va_number)"
    . "VALUES ('" . $email . "', '" . $password . "', '" . $firstName . "', '" . $lastName . "', '" . $phone . "', '" . $profilePictureURL . "', "
    . "'" . date('Y:m:d H:i:s') . "', '" . getIP() . "', '" . date('Y:m:d H:i:s') . "', '" . $nim . "', '" . $va . "')";
$c->query($sql);
echo 0;