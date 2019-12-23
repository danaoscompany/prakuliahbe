<?php
include 'db.php';
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$location = $_POST["location"];
$about = $_POST["about"];
$email = $_POST["email"];
$password = $_POST["password"];
$phone = $_POST["phone"];
$address = $_POST["address"];
$whatsappNumber = $_POST["whatsapp_number"];
$profilePictureSet = intval($_POST["profile_picture_set"]);
$profilePicture = $_POST["profile_picture_url"];
if ($profilePictureSet == 1) {
    $sql = "INSERT INTO partners (first_name, last_name, location, about, profile_picture, email, password, phone, address, whatsapp_number) VALUES "
        . "('" . $firstName . "', '" . $lastName . "', '" . $location . "', '" . $about . "', '" . $profilePicture . "', '" . $email . "', '" . $password . "', '" . $phone . "', '" . $address . "', '" . $whatsappNumber . "')";
} else {
    $sql = "INSERT INTO partners (first_name, last_name, location, about, email, password, phone, address, whatsapp_number) VALUES "
        . "('" . $firstName . "', '" . $lastName . "', '" . $location . "', '" . $about . "', '" . $email . "', '" . $password . "', '" . $phone . "', '" . $address . "', '" . $whatsappNumber . "')";
}
$c->query($sql);
echo 0;