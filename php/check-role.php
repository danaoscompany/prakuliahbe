<?php
include 'db.php';
$userID = intval($_POST["user_id"]);
$role = $_POST["role"];
$roleID = intval($_POST["role_id"]);
$results = $c->query("SELECT * FROM roles WHERE user_id=" . $userID . " AND role='" . $role . "' AND role_id=" . $roleID);
if ($results && $results->num_rows > 0) {
    $row = $results->fetch_assoc();
    echo intval($row["enabled"]);
} else {
    echo 0;
}