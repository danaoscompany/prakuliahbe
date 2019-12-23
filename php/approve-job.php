<?php
include 'db.php';
$id = intval($_POST["id"]);
$adminID = intval($_POST["admin_id"]);
// Check if admin has role
$results = $c->query("SELECT * FROM roles WHERE user_id=" . $adminID . " AND role='admin' AND role_id=2 AND enabled=1");
if ($results && $results->num_rows > 0) {
    $results = $c->query("SELECT * FROM jobs WHERE id=" . $id . " AND available=1");
    if ($results && $results->num_rows > 0) {
        $row = $results->fetch_assoc();
        if (intval($row["available"]) == 1) {
            echo -1;
        }
    } else {
        $c->query("UPDATE jobs SET available=1 WHERE id=" . $id);
        echo 0;
    }
} else {
    echo -2;
}