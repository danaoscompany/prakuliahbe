<?php
include 'db.php';
$userId = intval($_POST["id"]);
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$email = $_POST["email"];
$phone = $_POST["phone"];
$password = $_POST["password"];
$nim = $_POST["nim"];
$va = $_POST["va"];
$profilePictureSet = intval($_POST["profile_picture_set"]);
$profilePictureURL = $_POST["profile_picture_url"];
$sql = "UPDATE users SET first_name='" . $firstName . "', last_name='" . $lastName . "', phone='" . $phone . "', password='" . $password . "', nim='" . $nim . "', va_number='" . $va . "', email='" . $email . "'";
if ($profilePictureSet) {
    $sql .= ", profile_picture='" . $profilePictureURL . "'";
}
$sql .= " WHERE id=" . $userId;
$c->query($sql);
echo 0;