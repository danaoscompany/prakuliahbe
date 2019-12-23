<?php
include 'db.php';
$userID = intval($_POST["user_id"]);
$role = $_POST["role"];
$results = $c->query("SELECT * FROM roles WHERE user_id=" . $userID . " AND role='admin'");
$roles = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        array_push($roles, $row);
    }
}
echo json_encode($roles);