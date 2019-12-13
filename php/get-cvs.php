<?php
include 'db.php';
$userID = intval($_POST["user_id"]);
$items = [];
$sql = "SELECT * FROM cv WHERE user_id=" . $userID;
$results = $c->query($sql);
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($items, $row);
	}
}
echo json_encode($items);