<?php
include 'db.php';
$userID = intval($_POST["user_id"]);
$fcmID = $_POST["fcm_id"];
$role = $_POST["role"];
if ($role == "user") {
	$c->query("UPDATE users SET fcm_id='" . $fcmID . "' WHERE id=" . $userID);
} else if ($role == "employer") {
	$c->query("UPDATE employers SET fcm_id='" . $fcmID . "' WHERE id=" . $userID);
}