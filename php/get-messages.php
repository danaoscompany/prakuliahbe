<?php
include 'db.php';
$results = $c->query("SELECT * FROM messages");
$messages = [];
if ($results && $results->num_rows > 0) {
    while ($row = $results->fetch_assoc()) {
        $admins = $c->query("SELECT * FROM admins WHERE id=" . $row["sender_id"]);
        if ($admins && $admins->num_rows > 0) {
            $admin = $admins->fetch_assoc();
            $row["sender_name"] = $admin["first_name"] . " " . $admin["last_name"];
        } else {
            $row["sender_name"] = "";
        }
        $receiverRole = $row["receiver_role"];
        if ($receiverRole == "employer") {
            $employers = $c->query("SELECT * FROM employers WHERE id=" . $row["receiver_id"]);
            if ($employers && $employers->num_rows > 0) {
                $employer = $employers->fetch_assoc();
                $row["receiver_name"] = $employer["full_name"];
            }
        } else if ($receiverRole == "user") {
            $users = $c->query("SELECT * FROM users WHERE id=" . $row["receiver_id"]);
        }
        array_push($messages, $row);
    }
}
echo json_encode($messages);