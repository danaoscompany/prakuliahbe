<?php
include 'db.php';
$id = intval($_POST["id"]);
$fullName = $_POST["full_name"];
$email = $_POST["email"];
$password = $_POST["password"];
$phone = $_POST["phone"];
$company = $_POST["company"];
$website = $_POST["website"];
$biodata = $_POST["biodata"];
$profilePicture = $_POST["profile_picture"];
$sql = "UPDATE employers SET email='" . $email . "', password='" . $password . "', full_name='" . $fullName . "', company_name='" . $company . "', card_picture='" . $profilePicture . "', website='" . $website . "', phone='" . $phone . "', biodata='" . $biodata . "' WHERE id=" . $id;
$c->query($sql);
echo $sql;