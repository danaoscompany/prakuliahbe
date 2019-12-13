<?php
include 'db.php';
$userID = intval($_POST["user_id"]);
$keyword = $_POST["keyword"];
$results = $c->query("SELECT * FROM messages WHERE user_id=" . $userID . " AND title LIKE '%{" . $keyword . "}%' OR message LIKE '%{" . $keyword . "}%'");
$messages = [];
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		array_push($messages, $row);
	}
}
echo json_encode($messages);