<?php
include 'db.php';
$adminId = $_POST["id"];
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$email = $_POST["email"];
$password = $_POST["password"];
$phone = $_POST["phone"];
$c->query("UPDATE admins SET email='" . $email . "', password='" . $password . "', name='" . $name . "', phone='" . $phone . "' WHERE id='" . $adminId . "'");
echo 0;