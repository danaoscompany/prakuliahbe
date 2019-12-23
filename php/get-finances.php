<?php
include 'db.php';
$items = [];
$results = $c->query("SELECT * FROM finance");
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        $userID = intval($row["user_id"]);
        $users = $c->query("SELECT * FROM users WHERE id=" . $userID);
        if ($users && $users->num_rows > 0) {
            $user = $users->fetch_assoc();
            $row["full_name"] = $user["first_name"] . " " . $user["last_name"];
        }
        array_push($items, $row);
    }
}
echo json_encode($items);
