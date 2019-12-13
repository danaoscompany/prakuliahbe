<?php
include 'db.php';
$userID = intval($_POST["user_id"]);
$role = $_POST["role"];
$messages = [];
$results = $c->query("select m1.* from messages m1 left outer join messages m2 on (m1.id<m2.id and m1.opponent_id=m2.opponent_id and m1.user_id=" . $userID . " and m2.user_id=" . $userID . " and m1.outbox=0 and m2.outbox=0 and m1.role='user' and m2.role='user') where m2.id is null and m1.user_id=" . $userID . " and m1.outbox=0 and m1.role='user'");
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		$users = NULL;
		if ($role == "user") {
			$users = $c->query("SELECT * FROM users WHERE id=" . $row["opponent_id"]);
			if ($users && $users->num_rows > 0) {
				$user = $users->fetch_assoc();
				$row["sender_name"] = $user["first_name"] . " " . $user["last_name"];
			}
		} else if ($role == "employer") {
			$users = $c->query("SELECT * FROM employers WHERE id=" . $row["opponent_id"]);
			if ($users && $users->num_rows > 0) {
				$user = $users->fetch_assoc();
				$row["sender_name"] = $user["full_name"];
			}
		}
		array_push($messages, $row);
	}
}
$results = $c->query("select m1.* from messages m1 left outer join messages m2 on (m1.id<m2.id and m1.opponent_id=m2.opponent_id and m1.user_id=" . $userID . " and m2.user_id=" . $userID . " and m1.outbox=1 and m2.outbox=1 and m1.role='user' and m2.role='user') where m2.id is null and m1.user_id=" . $userID . " and m1.outbox=1 and m1.role='user'");
if ($results && $results->num_rows > 0) {
	while ($row = $results->fetch_assoc()) {
		if ($role == "user") {
			$users = $c->query("SELECT * FROM users WHERE id=" . $row["opponent_id"]);
			if ($users && $users->num_rows > 0) {
				$user = $users->fetch_assoc();
				$row["sender_name"] = $user["first_name"] . " " . $user["last_name"];
			}
		} else if ($role == "employer") {
			$users = $c->query("SELECT * FROM employers WHERE id=" . $row["opponent_id"]);
			if ($users && $users->num_rows > 0) {
				$user = $users->fetch_assoc();
				$row["sender_name"] = $user["full_name"];
			}
		}
		array_push($messages, $row);
	}
}
echo json_encode($messages);